import { createTheme } from "@mui/material/styles";
import { primaryColors, secondaryColors } from "./colors"

const CustomTheme = createTheme({
  palette: {
    primary: {
      main: primaryColors[600],
      light: primaryColors[200],
      dark: primaryColors[800]
    },
    secondary: {
      main: secondaryColors[500],
      light: primaryColors[200],
      dark: primaryColors[800]
    },
    text: {
      secondary: primaryColors[700]
    }
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
  custom: {
    primary: primaryColors,
    secondary: secondaryColors,
  },
})

export default CustomTheme
