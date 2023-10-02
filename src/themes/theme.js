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

// Defining the colors of nodes in the chart.
export const chartColorPalette = {
  category: {
    primary: "#c3c3c3",
    secondary: "#7438E2",
  }, // category default
  finding: "#F5C2C0", // finding default (unclassified)
  clusters: [
    "#4352D1",
    "#ED6F78",
    "#F2C947",
    "#9DCF62",
    "#FCF467",
    "#5FCAD2",
    "#4CA58A",
  ],
};
