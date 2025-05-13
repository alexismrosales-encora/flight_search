import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      primary: {
        [key: number]: string;
      };
      secondary: {
        [key: number]: string;
      }
    };
  }
  interface ThemeOptions {
    custom?: {
      primary?: {
        [key: number]: string;
      };
      secondary?: {
        [key: number]: string;
      }
    };
  }
}
