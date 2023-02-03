import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

// Available for when AuthN added.
// Sentry.setUser({ email: 'joel.brighton@outlook.com' });

// For some reason following message is concatenated to next error message!
console.info('');
console.info(
  `Sentry initialized. dsn: ${process.env.REACT_APP_SENTRY_DSN}. env: ${process.env.REACT_APP_SENTRY_ENVIRONMENT}`,
  'color:blue'
);
