"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Dispatch, SetStateAction } from "react";

const LOCAL_STORAGE_CHANGE_EVENT = "pulseboard-local-storage-change";

function parseStoredValue<T>(storedValue: string, fallback: T) {
  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
}

function emitLocalStorageChange(key: string) {
  window.dispatchEvent(
    new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }),
  );
}

function subscribeToStorageKey(key: string, callback: () => void) {
  function handleChange(event: Event) {
    if (event instanceof StorageEvent) {
      if (event.key === key) {
        callback();
      }

      return;
    }

    const customEvent = event as CustomEvent<{ key?: string }>;

    if (customEvent.detail?.key === key) {
      callback();
    }
  }

  window.addEventListener("storage", handleChange);
  window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleChange);
  };
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const initialSnapshot = useMemo(
    () => JSON.stringify(initialValue),
    [initialValue],
  );

  const subscribe = useCallback(
    (callback: () => void) => subscribeToStorageKey(key, callback),
    [key],
  );

  const getSnapshot = useCallback(
    () => window.localStorage.getItem(key) ?? initialSnapshot,
    [initialSnapshot, key],
  );

  const getServerSnapshot = useCallback(() => initialSnapshot, [initialSnapshot]);
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const value = useMemo(
    () => parseStoredValue(storedValue, initialValue),
    [initialValue, storedValue],
  );

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (nextValue) => {
      const currentValue = parseStoredValue(storedValue, initialValue);
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (currentValue: T) => T)(currentValue)
          : nextValue;

      window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      emitLocalStorageChange(key);
    },
    [initialValue, key, storedValue],
  );

  return [value, setValue, true];
}
