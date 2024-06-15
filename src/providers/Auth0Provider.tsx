import { AppState, Auth0Provider, CacheLocation } from '@auth0/auth0-react';
import { ReactElement, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Auth0ProviderProps = {
    children: ReactNode;
};

const Provider = ({ children }: Auth0ProviderProps): ReactElement => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        navigate(appState?.returnTo || '/gallery');
    };

    // N.B. Returns to /loading and then runs onRedirectCallback().
    const auth0ProviderConfig = {
        domain: import.meta.env.VITE_APP_AUTH0_DOMAIN as string,
        clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID as string,
        onRedirectCallback: onRedirectCallback,
        authorizationParams: {
            audience: import.meta.env.VITE_APP_AUTH0_API_AUDIENCE,
            redirect_uri: import.meta.env.VITE_APP_AUTH0_CALLBACK_URL,
        },
        redirectUri: window.location.origin,
        useRefreshTokens: true,
        cacheLocation: 'memory' as CacheLocation,
        grant_type: 'client_credentials',
    };

    return <Auth0Provider {...auth0ProviderConfig}>{children}</Auth0Provider>;
};

export { Provider };
