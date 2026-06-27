import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import { ApolloProvider } from '@apollo/client/react';
import { ReactElement, ReactNode } from 'react';

type ProviderProps = {
    children: ReactNode;
};

export const Provider = ({ children }: ProviderProps): ReactElement => {
    const httpLink = new HttpLink({
        uri: import.meta.env.VITE_APP_GRAPH_URL,
    });

    const authLink = setContext(async (operation, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: '',
            },
        };
    });

    const client = new ApolloClient({
        link: from([authLink, httpLink]),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
            },
        },
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
