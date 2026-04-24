"use client";

import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import {
  isLanguage,
  translate,
  type Language,
  type TranslationKey,
} from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "lifequest:language";

export function useLanguage() {
  const [storedLanguage, setStoredLanguage] = useLocalStorageState<Language>(
    LANGUAGE_STORAGE_KEY,
    "en",
  );
  const language = isLanguage(storedLanguage) ? storedLanguage : "en";

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      setStoredLanguage(nextLanguage);
    },
    [setStoredLanguage],
  );

  const toggleLanguage = useCallback(() => {
    setStoredLanguage((currentLanguage) =>
      currentLanguage === "ka" ? "en" : "ka",
    );
  }, [setStoredLanguage]);

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, number | string>) =>
      translate(language, key, values),
    [language],
  );

  return {
    language,
    setLanguage,
    t,
    toggleLanguage,
  };
}
