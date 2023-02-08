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
  components: {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: '0',
          paddingTop: '0',
        },
        title: {
          fontFamily: 'TangerineBold',
          fontSize: '2.2rem',
        },
        subheader: {
          fontFamily: 'TangerineBold',
          fontSize: '1.8rem',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: '0',
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h2' },
          style: {
            fontFamily: 'Tangerine',
            fontSize: '4rem',
          },
        },
        {
          props: { variant: 'h3' },
          style: {
            fontFamily: 'Tangerine',
            fontSize: '2.5rem',
          },
        },
      ],
    },
  },
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
