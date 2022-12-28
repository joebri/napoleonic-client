import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CssBaseline from '@mui/material/CssBaseline';
import { Helmet } from 'react-helmet';

import { theme, ThemeProvider } from './theme';
import { AppProvider } from './AppContext';
import useConfig from './hooks/useConfig';
import { Home } from './pages/Home/Home';

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
    <React.StrictMode>
      <Helmet>
        <title>Uniformology: Napoleonic</title>
      </Helmet>
      <CssBaseline />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AppProvider>
            <Home />
          </AppProvider>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
}

export default App;
