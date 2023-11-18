import { useState, useEffect } from 'react';
import "./App.css";
import Navbar, {NavbarProps} from "./components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import ConsoleLog from "./components/ConsoleLog";
import PinState, {PinStateIface} from "./components/PinState";
import DeviceTable, {DeviceStateIface} from "./components/DeviceTable";
import theme from './theme';

const eventsEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/events`;

export const JSON_EXAMPLE = `{
  "io": {
      "UND": {"type": "output", "bits": 0, "ioNum": 1}
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

// can be used for development
// export const JSON_EXAMPLE = `{
//   "io": {
//       "MOS": {"type": "output", "bits": 32768, "ioNum": 16},
//       "REL": {"type": "output", "bits": 32767, "ioNum": 15},
//       "OPT": {"type": "output", "bits": 0, "ioNum": 8 },
//       "TTL": {"type": "output", "bits": 31, "ioNum": 8 },
//       "DUPA": {"type": "input", "bits": 69, "ioNum": 12}
//   },
//   "buttons": {
//       "groups": {
//           "a": "OFF",
//           "b": "OFF",
//           "c": "OFF",
//           "d": "OFF"
//       }
//   },
//   "msg": "OK",
//   "retCode": 200
// }`

interface pinProps {
  type: string;
  bits: number;
  ioNum: number;
}

function pinStateFromJSON(json: string): PinStateIface {  
  // console.log(`parsing json: ${json}`);  
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

function buttonStateFromJSON(json: string): DeviceStateIface {  
  // console.log(`parsing json: ${json}`);
  const deviceState : DeviceStateIface = {};

  const parsed = JSON.parse(json);
  for (const [key, value] of Object.entries(parsed.buttons.groups)) {
    if (deviceState[key] === undefined) {

    } else {
      deviceState[key].currentButton = value as string;
      deviceState[key].confirmed = false;
    }    
  }
  return deviceState;
}

const App = () => {
  const [logs, setLogs] = useState<string[]>([">> connecting to the device..."]);
  const [pinState, setPinState] = 
    useState<PinStateIface>(() => pinStateFromJSON(JSON_EXAMPLE));
  const [deviceState, setDeviceState] = 
    useState<DeviceStateIface>(() => buttonStateFromJSON(JSON_EXAMPLE));

  const [backendState, setBackendState] = 
    useState<string>(() => "unknown");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const sse = new EventSource(eventsEndpoint);

    const setHeartbeatTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("No heartbeat event received for 5 seconds.");
        // You can add your notification logic here
        setBackendState("timeout");
      }, 5 * 1000);
    };

    function getRealtimeData(data: any) {
        console.log(`Connected!`);
        console.log(data);
        setLogs((prevLogs) => [...prevLogs, data]);
      } 
    sse.onmessage = e => getRealtimeData(e.data);
    sse.onerror = () => {
      setBackendState("disconnected");
    }
    sse.onopen = () => {
      console.log("socket open");
      setBackendState("connected");
    }
    sse.addEventListener('log', (e) => {
      console.log(e.data);
      setLogs((prevLogs) => [...prevLogs, e.data]);
    });
    sse.addEventListener('state', (e) => {
      // console.log("New state:");
      try {
        setPinState(pinStateFromJSON(e.data));
        setDeviceState(buttonStateFromJSON(e.data));
      } catch (error) {
        console.log(error);
      }
    });    
    sse.addEventListener('heartbeat', (e) => {
      setHeartbeatTimeout();
      console.log("dokidoki");
    });

    return () => {
      clearTimeout(timeoutId); // Clear the timeout if the component unmounts
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
        <Grid container spacing={{ xs: 2, sm: 3 }}
          sx={{
            py: { xs: "1rem", sm: "1.5rem" },
            px: { xs: "1rem", sm: "1.5rem" },
            justifyContent: "center",
            alignItems: 'flex-start',
            maxWidth: '1536px',
          }}
        >
          <Grid item xs={12} sx={{ pt: '1 !important' }}>
            <Navbar backendState={backendState} />
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <DeviceTable devices={deviceState}/>
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={2} pb={2} gap={{ xs: 2, sm: 3 }} display='flex' container direction='column'>
            <ConsoleLog logs={logs} />
            <PinState pins={pinState} />
          </Grid>
        </Grid>
      </Box>
      <p>Backend state: {backendState}</p>
    </ThemeProvider>
  );
};

export default App;
