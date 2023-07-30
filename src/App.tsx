import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';

import { Home } from 'pages/Home/Home';
import { ThemeProvider, theme } from 'theme';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

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
            <StyledEngineProvider injectFirst>
              <Home />
            </StyledEngineProvider>
          </RecoilRoot>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export { App };
