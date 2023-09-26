import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
// import DeviceTable from "./components/DeviceTable";
import { Grid } from "@mui/material";
import ConsoleLog from "./components/ConsoleLog";
import Stack from "@mui/material/Stack";
import DeviceTable from "./components/DeviceTable";
// import TabsComponent from "./components/Tabs";
import DeviceState from "./components/DeviceState";

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

const App = () => {
  const [logs, setLogs] = useState<string[]>(["connecting to the device..."]);
  const [deviceState, setDeviceState] = useState<JSON>({} as JSON);

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
      console.log(e.data);
      setDeviceState(JSON.parse(e.data));
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
              <DeviceState stateJson={deviceState} />
            </Grid>
          </Grid>
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default App;
