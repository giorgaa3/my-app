"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getLevelInfo } from "@/lib/lifequest";
import { cn } from "@/lib/utils";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

type AppShellProps = {
  children: ReactNode;
};

const navItems: Array<{
  description: string;
  href: string;
  icon: IconName;
  label: string;
}> = [
  {
    description: "Overview",
    href: "/",
    icon: "spark",
    label: "Dashboard",
  },
  {
    description: "Plan and finish work",
    href: "/tasks",
    icon: "list",
    label: "Tasks",
  },
  {
    description: "Daily routines",
    href: "/habits",
    icon: "flame",
    label: "Habits",
  },
  {
    description: "25-minute sessions",
    href: "/focus",
    icon: "circle",
    label: "Focus",
  },
  {
    description: "Today’s rewards",
    href: "/quests",
    icon: "target",
    label: "Quests",
  },
  {
    description: "Badges and shop",
    href: "/achievements",
    icon: "checkCircle",
    label: "Achievements",
  },
  {
    description: "Character stats",
    href: "/profile",
    icon: "flag",
    label: "Profile",
  },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isStorageReady, profile, theme, toggleTheme } = useLifeQuest();
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
                  Level {levelInfo.level}
                </p>
                <p className="section-muted truncate text-xs font-semibold">
                  {levelInfo.title}
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
              {levelInfo.xpToNextLevel} XP to next level
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <BrandBlock compact />
              <ThemeToggle onToggle={toggleTheme} theme={theme} />
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
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <header className="hidden items-center justify-end gap-3 px-6 pt-5 lg:flex">
            <div className="accent-badge inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
              <Icon name="checkCircle" className="h-4 w-4" />
              {isStorageReady ? "Autosaved locally" : "Syncing"}
            </div>
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
          Productivity RPG
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
        <span className="block text-sm font-semibold">{item.label}</span>
        <span
          className={cn(
            "block truncate text-xs font-medium",
            active ? "text-white/65" : "text-[var(--muted)]",
          )}
        >
          {item.description}
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
