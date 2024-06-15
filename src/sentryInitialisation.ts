import { browserTracingIntegration } from '@sentry/browser';
import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    integrations: [browserTracingIntegration()],
    environment: import.meta.env.VITE_APP_SENTRY_ENVIRONMENT,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
});

// Available for when AuthN added.
// Sentry.setUser({ email: 'joel.brighton@outlook.com' });

// For some reason following message is concatenated to next error message!
console.info('');
console.info(
    `Sentry initialized. dsn: ${import.meta.env.VITE_APP_SENTRY_DSN}. env: ${
        import.meta.env.VITE_APP_SENTRY_ENVIRONMENT
    }`,
    'color:blue'
);
