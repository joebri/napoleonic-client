import { useState } from 'react';
import { logError } from '../utilities/logError';

function useLocalStorage<T>(key: string, initialValue: T) {
  const moduleName = `${useLocalStorage.name}.ts`;

  // State to store our value.
  // Pass initial state function to useState so logic is only executed once.
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue.
      return item ? JSON.parse(item) : initialValue;
    } catch (exception) {
      // If error also return initialValue.
      logError({
        moduleName,
        name: 'setStoredValue',
        exception,
      });
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState.
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state.
      setStoredValue(valueToStore);
      // Save to local storage.
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (exception) {
      // A more advanced implementation would handle the error case.
      logError({ moduleName, name: 'setValue', exception });
    }
  };

  return [storedValue, setValue] as const;
}

export { useLocalStorage };
