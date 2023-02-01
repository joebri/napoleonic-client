import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './fonts/Tangerine/Tangerine-Regular.ttf';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

// For some reason following message is concatenated to next error message!
console.info('');
console.info(
  `Sentry initialized. dsn: ${process.env.REACT_APP_SENTRY_DSN}. env: ${process.env.REACT_APP_SENTRY_ENVIRONMENT}`,
  'color:blue'
);

// Available for when AuthN added.
// Sentry.setUser({ email: 'joel.brighton@outlook.com' });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((vital) => {
  // console.log(vital);
});
