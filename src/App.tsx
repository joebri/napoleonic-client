import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CssBaseline from '@mui/material/CssBaseline';
import { RecoilRoot } from 'recoil';

import { Home } from 'pages/Home/Home';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

import { theme, ThemeProvider } from 'theme';

function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPH_URL,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  });

  return (
    <BrowserRouter>
      <HelmetProvider>
        <Helmet>
          <title>Uniformology: Napoleonic</title>
        </Helmet>
        <CssBaseline />
        <ErrorBoundary>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              <RecoilRoot>
                <Home />
              </RecoilRoot>
            </ThemeProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export { App };
