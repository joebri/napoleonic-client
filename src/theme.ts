import { createTheme } from '@mui/material/styles';
import { green, blueGrey, orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[500],
    },
    secondary: {
      main: green[500],
    },
  },
  status: {
    danger: orange[500],
  },
});

export { ThemeProvider } from '@emotion/react';
export type { Theme } from '@mui/material/styles';
export { theme };
