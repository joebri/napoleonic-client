import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './fonts/Tangerine/Tangerine-Regular.ttf';
import './index.css';

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
    <App />
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
