import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider, GraphQLProvider } from 'providers';

import { App } from './App';
import './fonts/Tangerine/Tangerine-Regular.ttf';
import './index.scss';

console.info(
  `Starting "${process.env.REACT_APP_NAME}", version: ${process.env.REACT_APP_VERSION}`
);
console.info(`Attaching to server url: ${process.env.REACT_APP_GRAPH_URL}`);

let isSentryEnabled =
  process.env.REACT_APP_SENTRY_ENABLED?.toLowerCase() === 'true' ? true : false;
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
          <App />
        </GraphQLProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

let isWebVitalsEnabled =
  process.env.REACT_APP_WEBVITALS_ENABLED?.toLowerCase() === 'true'
    ? true
    : false;
if (isWebVitalsEnabled) {
  (async () => {
    await import('./webVitalsInitialisation');
  })();
}
