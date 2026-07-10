import { useCallback, useEffect, useState } from "react";
import { useEventCallback } from "./useEventCallback";
import { useEventListener } from "./useEventListener";

const IS_SERVER = typeof window === "undefined";

/**
 * Custom hook that uses the [`localStorage API`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist state across page reloads.
 * @param {string} key - The key under which the value will be stored in local storage.
 * @param {any | (() => any)} initialValue - The initial value of the state or a function that returns the initial value.
 * @param {object} [options] - Options for customizing the behavior of serialization and deserialization (optional).
 * @param {function} [options.serializer] - A function to serialize the value before storing it.
 * @param {function} [options.deserializer] - A function to deserialize the stored value.
 * @param {boolean} [options.initializeWithValue=true] - If `true` (default), the hook will initialize reading the local storage. In SSR, you should set it to `false`, returning the initial value initially.
 * @returns {[any, function, function]} A tuple containing the stored value, a function to set the value and a function to remove the key from storage.
 */
export function useLocalStorage(key, initialValue, options = {}) {
  const { initializeWithValue = true } = options;

  const serializer = useCallback(
    (value) => {
      if (options.serializer) {
        return options.serializer(value);
      }

      return JSON.stringify(value);
    },
    [options],
  );

  const deserializer = useCallback(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      // Support 'undefined' as a value
      if (value === "undefined") {
        return undefined;
      }

      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue;

      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return defaultValue; // Return initialValue if parsing fails
      }

      return parsed;
    },
    [options, initialValue],
  );

  const readValue = useCallback(() => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue();
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue = useEventCallback((value) => {
    if (IS_SERVER) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`,
      );
    }

    try {
      const newValue = value instanceof Function ? value(readValue()) : value;

      window.localStorage.setItem(key, serializer(newValue));
      setStoredValue(newValue);

      window.dispatchEvent(new StorageEvent("local-storage", { key }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  });

  const removeValue = useEventCallback(() => {
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key “${key}” even though environment is not a client`,
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    window.localStorage.removeItem(key);
    setStoredValue(defaultValue);

    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  });

  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  const handleStorageChange = useCallback(
    (event) => {
      if (event.key && event.key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue],
  );

  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
