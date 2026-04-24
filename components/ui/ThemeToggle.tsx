"use client";

import { Icon } from "@/components/ui/Icon";
import type { ThemeMode } from "@/lib/types";

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-button inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition"
      onClick={onToggle}
      type="button"
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-4 w-4" />
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
