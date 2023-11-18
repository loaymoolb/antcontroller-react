import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
    typography: {
      fontFamily: "Nunito Sans, sans-serif",
      fontSize: 12,
    },
    palette: {
      primary: {
        main: "#080B0C",
        dark: "#909090",
        light: "#E9EDEF"
      },
      secondary: {
        main: "#ABC8C7",
        dark: "#D2DADF",
        light: "#E5E5E5", 
      },
      success: {
        main: "#D98EDA",
      },
    },
});

theme = responsiveFontSizes(theme);

export default theme