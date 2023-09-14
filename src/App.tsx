import React from "react";
import "./App.css";
import "./controllers/guiController.js";
import "./controllers/jsonConfigController.js";
import Navbar from "./components/Navbar";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
// import DeviceTable from "./components/DeviceTable";
import { Grid } from "@mui/material";
import RecentResponse from "./components/RecentResponse";
import Stack from "@mui/material/Stack";
import DeviceTable from "./components/DeviceTable";
import TabsComponent from "./components/Tabs";

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
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
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
            <Grid item xs={12} md={6}>
              <TabsComponent />
              <DeviceTable />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentResponse />
            </Grid>
          </Grid>
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default App;
