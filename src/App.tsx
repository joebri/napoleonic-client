import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CssBaseline from '@mui/material/CssBaseline';

import { Home } from 'pages/Home/Home';
import { ErrorBoundary } from './ErrorBoundary';

import { AppProvider } from 'AppContext';
import { theme, ThemeProvider } from 'theme';
import useConfig from 'hooks/useConfig';

function App() {
  const client = new ApolloClient({
    uri: useConfig('GRAPH_URL'),
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
              <AppProvider>
                <Home />
              </AppProvider>
            </ThemeProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
