import { useState, useEffect } from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import ConsoleLog from "./components/ConsoleLog";
import DeviceTable from "./components/DeviceTable";
import PinState, {PinStateIface} from "./components/PinState";
import theme from './theme';

const eventsEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/events`;

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

  console.log(pinState)

  return (
    <ThemeProvider theme={theme}>
      <Box className="App" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        width: '100vw',
        overflow: { xs: 'auto', md: 'hidden' },
      }}>
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            py: { xs: "1rem", sm: "1.5rem" },
            px: { xs: "1rem", sm: "1.5rem" },
            justifyContent: "center",
            alignItems: 'flex-start',
            maxWidth: '1536px',
          }}
        >
          <Grid item xs={12} sx={{ pt: '1 !important' }}>
            <Navbar />
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <DeviceTable />
          </Grid>
          <Grid item xs={12} sm={5} md={4} lg={3} pb={2} gap={{ xs: 2, sm: 3 }} display='flex' container direction='column'>
            <ConsoleLog logs={logs} />
            <PinState pins={pinState} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;
