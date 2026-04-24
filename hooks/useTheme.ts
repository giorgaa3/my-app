"use client";

import { useEffect } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorage";
import type { ThemeMode } from "@/lib/types";

const THEME_STORAGE_KEY = "pulseboard:theme";

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<ThemeMode>(
    THEME_STORAGE_KEY,
    "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return {
    setTheme,
    theme,
    toggleTheme,
  };
}
