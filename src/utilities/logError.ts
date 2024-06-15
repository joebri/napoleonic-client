import * as Sentry from '@sentry/react';

interface LogErrorBaseProps {
    exception: unknown;
    moduleName: string;
    name: string;
}

const logError = <LogErrorProps extends LogErrorBaseProps>({
    exception,
    moduleName,
    name,
    ...rest
}: LogErrorProps) => {
    const diagnostics: Record<string, unknown> = {
        ...rest,
        name,
    };
    let formattedDiagnostics: Record<string, unknown> = {};
    for (const key in diagnostics) {
        if (typeof diagnostics[key] === 'object') {
            formattedDiagnostics[key] = JSON.stringify(
                diagnostics[key],
                null,
                2
            );
        } else {
            formattedDiagnostics[key] = diagnostics[key];
        }
    }

    let isSentryEnabled =
        import.meta.env.VITE_APP_SENTRY_ENABLED?.toLowerCase() === 'true'
            ? true
            : false;

    if (isSentryEnabled) {
        Sentry.withScope((scope) => {
            scope.setTag('moduleName', moduleName);
            scope.setLevel('error');
            scope.setContext('Diagnostics', formattedDiagnostics);
            Sentry.captureException(exception);
        });
    } else {
        console.error(
            `ModuleName: ${moduleName}. Name: ${name}, Diagnostics: ${JSON.stringify(
                formattedDiagnostics
            )}. Exception: ${exception}`
        );
    }
};

export { logError, type LogErrorBaseProps };
