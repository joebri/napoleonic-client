import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Home } from 'pages/Home/Home';
import { AuthProvider, GraphQLProvider } from 'providers';
import { ThemeProvider, theme } from 'theme';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import './fonts/Tangerine/Tangerine-Regular.ttf';
import './index.scss';
import { HelmetProvider as CustomHelmetProvider } from './providers/HelmetProvider';

console.info(
    `Starting "${import.meta.env.VITE_APP_NAME}", version: ${
        import.meta.env.VITE_APP_VERSION
    }`
);
console.info(`Attaching to server url: ${import.meta.env.VITE_APP_GRAPH_URL}`);

let isSentryEnabled =
    import.meta.env.VITE_APP_SENTRY_ENABLED?.toLowerCase() === 'true'
        ? true
        : false;
if (isSentryEnabled) {
    (async () => {
        await import('./sentryInitialisation');
    })();
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <GraphQLProvider>
                    <HelmetProvider context={{}}>
                        <Helmet>
                            <title>Uniformology: Napoleonic</title>
                        </Helmet>
                        <CssBaseline />
                        <ErrorBoundary>
                            <ThemeProvider theme={theme}>
                                <RecoilRoot>
                                    <CustomHelmetProvider>
                                        <StyledEngineProvider injectFirst>
                                            <Home />
                                        </StyledEngineProvider>
                                    </CustomHelmetProvider>
                                </RecoilRoot>
                            </ThemeProvider>
                        </ErrorBoundary>
                    </HelmetProvider>
                </GraphQLProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);

const isWebVitalsEnabled =
    import.meta.env.VITE_APP_WEBVITALS_ENABLED?.toLowerCase() === 'true';

if (isWebVitalsEnabled) {
    (async () => {
        await import('./webVitalsInitialisation');
    })();
}
