import { useCallback, useEffect } from 'react';

export function useConfirmExit(isEnabled: boolean | Function) {
  const handler = useCallback(
    (event: any) => {
      const confirmIsEnabled =
        typeof isEnabled === 'function' ? isEnabled() : isEnabled;
      if (!confirmIsEnabled) return;

      event.preventDefault();
      event.returnValue = '';
      return;
    },
    [isEnabled]
  );

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, [isEnabled, handler]);
}
