import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactElement, ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

const Provider = ({ children }: ProviderProps): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPH_URL,
  });

  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessTokenSilently();

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { Provider };
