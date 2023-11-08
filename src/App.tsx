import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { Grid } from "@mui/material";
import ConsoleLog from "./components/ConsoleLog";
import Stack from "@mui/material/Stack";
import DeviceTable from "./components/DeviceTable";
import PinState ,{PinStateIface} from "./components/PinState";

const eventsEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/events`;

let theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans, sans-serif",
    fontSize: 16,
  },
  palette: {
    primary: {
      main: "#080B0C", // black
    },
    secondary: {
      main: "#ABC8C7", // ash gray
    },
    // secondaryLight: {
    //   main: "#D5E4E3" // ash gray
    //   // main: "#D2DADF" // cadet gray
    // },
    success: {
      main: "#60BE84",
    },
  },
});
theme = responsiveFontSizes(theme);

// export interface DeviceStateIface {
//   io: {
//     [key: string]: {
//       type: string;
//       bits: number;
//       ioNum: number;
//     };
//   }[];
//   buttons: {
//     groups: {
//       a: string;
//       b: string;
//       c: string;
//       d: string;
//     };
//   };
// }

export const JSON_EXAMPLE = `{
  "io": {
      "MOS": {"type": "output", "bits": 32768, "ioNum": 16},
      "REL": {"type": "output", "bits": 32767, "ioNum": 15},
      "OPT": {"type": "output", "bits": 0, "ioNum": 8 },
      "TTL": {"type": "output", "bits": 31, "ioNum": 8 },
      "DUPA": {"type": "input", "bits": 69, "ioNum": 12}
  },
  "buttons": {
      "groups": {
          "a": "OFF",
          "b": "OFF",
          "c": "OFF",
          "d": "OFF"
      }
  },
  "msg": "OK",
  "retCode": 200
}`

interface pinProps {
  type: string;
  bits: number;
  ioNum: number;
}

function pinStateFromJSON(json: string): PinStateIface {  
  console.log(`parsing json: ${json}`);
  
  const retPinState : PinStateIface = {};

  const parsed = JSON.parse(json);
  for (const [key, value] of Object.entries(parsed.io)) {
    // console.log(key);
    const pinprops = value as pinProps;
    retPinState[key] = {
      ioType: pinprops.type,
      pins: {}
    }
    for (let i = 0; i < pinprops.ioNum; i++) {
      retPinState[key].pins[i] = {
        state: (pinprops.bits & (1 << i)) > 0
      }
    }
  }
  return retPinState;
}

const App = () => {
  const [logs, setLogs] = useState<string[]>(["connecting to the device..."]);
  const [pinState, setPinState] = 
    useState<PinStateIface>(() => pinStateFromJSON(JSON_EXAMPLE));

  useEffect(() => {
    const sse = new EventSource(eventsEndpoint);
    function getRealtimeData(data: any) {
        console.log(`Connected!`);
        console.log(data);
        setLogs((prevLogs) => [...prevLogs, `Connected!`, data]);
      } 
    sse.onmessage = e => getRealtimeData(e.data);
    sse.onerror = () => {
      console.log("socket error. closing.");
      sse.close();
    }
    sse.addEventListener('log', (e) => {
      console.log(e.data);
      setLogs((prevLogs) => [...prevLogs, e.data]);
    });
    sse.addEventListener('state', (e) => {
      // console.log("New state:");
      try {
        setPinState(pinStateFromJSON(e.data));
      } catch (error) {
        console.log(error);
      }
    });
    return () => {
      sse.close();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        { <Navbar /> }
        <Stack sx={{ maxWidth: "1536px", mx: "auto" }}>
          <Grid
            container
            rowSpacing={{ xs: 4, md: 0 }}
            columnSpacing={{ xs: 0, md: 4 }}
            sx={{
              py: "2rem",
              px: { xs: "16px", sm: "24px" },
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Grid item xs={10} md={6}>
              {/* <TabsComponent /> */}
              <DeviceTable />
            </Grid>
            <Grid item xs={10} md={5}>
              <ConsoleLog logs={logs} />
            </Grid>
            <Grid item xs={2} md={1}>
              <PinState pins={pinState} />
            </Grid>
          </Grid>
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default App;
