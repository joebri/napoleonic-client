import CssBaseline from '@mui/material/CssBaseline';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';

import { Home } from 'pages/Home/Home';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

import { theme, ThemeProvider } from 'theme';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Uniformology: Napoleonic</title>
      </Helmet>
      <CssBaseline />
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <RecoilRoot>
            <Home />
          </RecoilRoot>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export { App };
