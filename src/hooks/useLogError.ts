import * as Sentry from '@sentry/react';

interface LogErrorBaseProps {
  name: string;
  exception: unknown;
}

const useLogError = (moduleName: string) => {
  const logError = <LogErrorProps extends LogErrorBaseProps>({
    name,
    exception,
    ...rest
  }: LogErrorProps) => {
    const diagnostics: Record<string, unknown> = {
      ...rest,
      name,
    };
    let formattedDiagnostics: Record<string, unknown> = {};
    for (const key in diagnostics) {
      if (typeof diagnostics[key] === 'object') {
        formattedDiagnostics[key] = JSON.stringify(diagnostics[key], null, 2);
      } else {
        formattedDiagnostics[key] = diagnostics[key];
      }
    }
    Sentry.withScope((scope) => {
      scope.setTag('moduleName', moduleName);
      scope.setLevel('error');
      scope.setContext('Diagnostics', formattedDiagnostics);
      Sentry.captureException(exception);
    });

    // Sentry.captureMessage('Test');
  };

  return { logError };
};

export { useLogError };
