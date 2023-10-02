import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    primary: {
      // purple
      main: "#7438E2",
      light: "#a280df",
      dark: "#5a18d5",
    },
    secondary: {
      // teal
      main: "#8CD1CA",
      light: "#b2ede7",
    },
  },
});

export const textFormTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    primary: {
      // purple
      main: "#a280df",
    },
    secondary: {
      // teal
      main: "#b2ede7",
    },
  },
});
