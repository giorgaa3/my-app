"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { calculateStreak, formatShortDate } from "@/lib/date";
import {
  getBestStreak,
  getHabitCategoryIcon,
  getWeeklyHabitProgress,
  isHabitCompletedToday,
} from "@/lib/habits";
import { getLifeAreaLabelKey } from "@/lib/i18n";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

type HabitRowProps = {
  habit: Habit;
  onDeleteHabit: (habitId: string) => void;
  onResetHabit: (habitId: string) => void;
  onToggleToday: (habitId: string) => void;
  todayKey: string;
};

export function HabitRow({
  habit,
  onDeleteHabit,
  onResetHabit,
  onToggleToday,
  todayKey,
}: HabitRowProps) {
  const completedToday = isHabitCompletedToday(habit, todayKey);
  const currentStreak = calculateStreak(habit.completedDates, todayKey);
  const bestStreak = getBestStreak(habit.completedDates);
  const weeklyProgress = getWeeklyHabitProgress(habit, todayKey);
  const categoryIcon = getHabitCategoryIcon(habit.category);
  const { t } = useLanguage();

  return (
    <li className="soft-card rounded-lg p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="dashboard-card flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl shadow-none">
            {habit.emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="section-title min-w-0 break-words text-sm font-semibold">
                {habit.name}
              </h3>
              <span className="accent-badge rounded-md px-2 py-0.5 text-xs font-semibold">
                {categoryIcon} {t(getLifeAreaLabelKey(habit.category))}
              </span>
            </div>
            <p className="section-muted mt-1 text-sm">
              {completedToday
                ? t("habit.completedToday")
                : t("habit.waitingToday")}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              aria-label={t("aria.resetHabit", { name: habit.name })}
              className="icon-button flex h-9 w-9 items-center justify-center rounded-md transition"
              onClick={() => onResetHabit(habit.id)}
              type="button"
            >
              <Icon name="reset" className="h-4 w-4" />
            </button>
            <button
              aria-label={t("aria.deleteHabit", { name: habit.name })}
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted)] transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
              onClick={() => onDeleteHabit(habit.id)}
              type="button"
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <HabitStat
            label={t("habit.current")}
            value={`${currentStreak} ${t("common.days")}`}
          />
          <HabitStat
            label={t("habit.best")}
            value={`${bestStreak} ${t("common.days")}`}
          />
          <HabitStat
            label={t("habit.week")}
            value={`${weeklyProgress.percentage}%`}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="section-muted text-xs font-semibold uppercase">
              {t("habit.weeklyProgress")}
            </p>
            <p className="section-muted text-xs font-semibold">
              {t("habit.weeklyProgressCount", {
                completed: weeklyProgress.completedCount,
              })}
            </p>
          </div>
          <div className="progress-track mb-3">
            <div
              className="progress-bar"
              style={{ width: `${weeklyProgress.percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.weekKeys.map((dateKey) => {
              const completed = habit.completedDates.includes(dateKey);

              return (
                <div className="min-w-0 text-center" key={dateKey}>
                  <p className="section-muted truncate text-[11px] font-semibold">
                    {formatShortDate(dateKey)}
                  </p>
                  <div
                    className={cn(
                      "mt-1 flex h-8 items-center justify-center rounded-md border text-xs font-semibold transition",
                      completed
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
                    )}
                    title={dateKey}
                  >
                    {completed ? <Icon name="check" className="h-4 w-4" /> : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className={cn(
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus:outline-none focus:ring-4",
            completedToday
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-100"
              : "primary-button focus:ring-slate-200",
          )}
          onClick={() => onToggleToday(habit.id)}
          type="button"
        >
          <Icon
            name={completedToday ? "checkCircle" : "circle"}
            className="h-4 w-4"
          />
          {completedToday ? t("habit.doneToday") : t("habit.markTodayComplete")}
        </button>
      </div>
    </li>
  );
}

type HabitStatProps = {
  label: string;
  value: string;
};

function HabitStat({ label, value }: HabitStatProps) {
  return (
    <div className="dashboard-card rounded-lg px-3 py-2 shadow-none">
      <p className="section-muted text-[11px] font-semibold uppercase">
        {label}
      </p>
      <p className="section-title mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
