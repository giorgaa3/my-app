"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLanguage } from "@/hooks/use-language";
import { getLevelTitleKey, type TranslationKey } from "@/lib/i18n";
import { getLevelInfo } from "@/lib/lifequest";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

const navItems: Array<{
  descriptionKey: TranslationKey;
  href: string;
  icon: IconName;
  labelKey: TranslationKey;
}> = [
  {
    descriptionKey: "nav.dashboard.description",
    href: "/",
    icon: "spark",
    labelKey: "nav.dashboard.label",
  },
  {
    descriptionKey: "nav.tasks.description",
    href: "/tasks",
    icon: "list",
    labelKey: "nav.tasks.label",
  },
  {
    descriptionKey: "nav.habits.description",
    href: "/habits",
    icon: "flame",
    labelKey: "nav.habits.label",
  },
  {
    descriptionKey: "nav.focus.description",
    href: "/focus",
    icon: "circle",
    labelKey: "nav.focus.label",
  },
  {
    descriptionKey: "nav.quests.description",
    href: "/quests",
    icon: "target",
    labelKey: "nav.quests.label",
  },
  {
    descriptionKey: "nav.achievements.description",
    href: "/achievements",
    icon: "checkCircle",
    labelKey: "nav.achievements.label",
  },
  {
    descriptionKey: "nav.profile.description",
    href: "/profile",
    icon: "flag",
    labelKey: "nav.profile.label",
  },
  {
    descriptionKey: "nav.shop.description",
    href: "/shop",
    icon: "shoppingBag",
    labelKey: "nav.shop.label",
  },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isStorageReady, profile, theme, toggleTheme } = useLifeQuest();
  const { t } = useLanguage();
  const levelInfo = getLevelInfo(profile.xp);

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1520px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[var(--border)] bg-[var(--surface)]/72 px-4 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <BrandBlock />

          <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                active={isActiveRoute(pathname, item.href)}
                item={item}
                key={item.href}
              />
            ))}
          </nav>

          <div className="dashboard-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-3xl">
                {levelInfo.avatar}
              </div>
              <div className="min-w-0">
                <p className="section-title truncate text-sm font-semibold">
                  {t("common.level")} {levelInfo.level}
                </p>
                <p className="section-muted truncate text-xs font-semibold">
                  {t(getLevelTitleKey(levelInfo.title))}
                </p>
              </div>
            </div>
            <div className="progress-track mt-4">
              <div
                className="progress-bar"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <p className="section-muted mt-2 text-xs font-medium">
              {t("dashboard.nextLevel", { xp: levelInfo.xpToNextLevel })}
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <BrandBlock compact />
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle onToggle={toggleTheme} theme={theme} />
              </div>
            </div>
            <nav
              aria-label="Main"
              className="mt-3 flex gap-2 overflow-x-auto pb-1"
            >
              {navItems.map((item) => (
                <Link
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition",
                    isActiveRoute(pathname, item.href)
                      ? "border-transparent bg-[var(--foreground)] text-[var(--surface)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </header>

          <header className="hidden items-center justify-end gap-3 px-6 pt-5 lg:flex">
            <div className="accent-badge inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
              <Icon name="checkCircle" className="h-4 w-4" />
              {isStorageReady ? t("app.autosaved") : t("app.syncing")}
            </div>
            <LanguageToggle />
            <ThemeToggle onToggle={toggleTheme} theme={theme} />
          </header>

          <main className="px-4 py-5 sm:px-6 lg:px-6 lg:pt-4">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function BrandBlock({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  return (
    <Link className="flex min-w-0 items-center gap-3" href="/">
      <div
        className={cn(
          "brand-mark flex shrink-0 items-center justify-center rounded-2xl text-xl",
          compact ? "h-10 w-10" : "h-12 w-12",
        )}
      >
        ⚔️
      </div>
      <div className="min-w-0">
        <p className="section-muted text-xs font-semibold uppercase">
          {t("app.brandSubtitle")}
        </p>
        <p className="section-title truncate text-lg font-semibold">
          LifeQuest
        </p>
      </div>
    </Link>
  );
}

function NavLink({
  active,
  item,
}: {
  active: boolean;
  item: (typeof navItems)[number];
}) {
  const { t } = useLanguage();

  return (
    <Link
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:-translate-y-0.5",
        active
          ? "bg-[var(--foreground)] text-[var(--surface)] shadow-lg"
          : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
      )}
      href={item.href}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
          active
            ? "bg-white/15"
            : "bg-[var(--surface-muted)] text-[var(--brand)] group-hover:bg-[var(--surface)]",
        )}
      >
        <Icon name={item.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{t(item.labelKey)}</span>
        <span
          className={cn(
            "block truncate text-xs font-medium",
            active ? "text-white/65" : "text-[var(--muted)]",
          )}
        >
          {t(item.descriptionKey)}
        </span>
      </span>
    </Link>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
