import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CssBaseline from '@mui/material/CssBaseline';

import { theme, ThemeProvider } from './theme';
import useConfig from './hooks/useConfig';
import { Home } from './pages/Home/Home';
import React from 'react';

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
      <CssBaseline />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Home />
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
}

export default App;
