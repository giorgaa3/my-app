"use client";

import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const languageOptions = ["en", "ka"] as const;

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      aria-label={t("aria.languageSwitcher")}
      className="inline-flex min-h-10 items-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1"
      role="group"
    >
      {languageOptions.map((option) => (
        <button
          className={cn(
            "min-h-8 rounded-md px-3 text-xs font-bold transition",
            language === option
              ? "bg-[var(--foreground)] text-[var(--surface)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]",
          )}
          key={option}
          onClick={() => setLanguage(option)}
          type="button"
        >
          {t(option === "en" ? "language.en" : "language.ka")}
        </button>
      ))}
    </div>
  );
}
