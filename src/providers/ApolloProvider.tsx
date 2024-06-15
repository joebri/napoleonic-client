import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    from,
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
        uri: import.meta.env.VITE_APP_GRAPH_URL,
    });

    const authLink = setContext(async (_, { headers }) => {
        const accessToken = await getAccessTokenSilently();
        // console.log('accessToken', accessToken);

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
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
            },
        },
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { Provider };
