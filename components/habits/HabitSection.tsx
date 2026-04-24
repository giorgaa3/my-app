"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { getHabitDashboardSummary } from "@/lib/habits";
import type { Habit, HabitInput } from "@/lib/types";
import { HabitForm } from "./HabitForm";
import { HabitRow } from "./HabitRow";

type HabitSectionProps = {
  habits: Habit[];
  onAddHabit: (habit: HabitInput) => void;
  onDeleteHabit: (habitId: string) => void;
  onResetHabit: (habitId: string) => void;
  onToggleToday: (habitId: string) => void;
  todayKey: string;
};

export function HabitSection({
  habits,
  onAddHabit,
  onDeleteHabit,
  onResetHabit,
  onToggleToday,
  todayKey,
}: HabitSectionProps) {
  const summary = getHabitDashboardSummary(habits, todayKey);
  const { t } = useLanguage();

  return (
    <section className="dashboard-card overflow-hidden rounded-2xl">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="section-muted text-sm font-semibold uppercase">
              {t("habit.eyebrow")}
            </p>
            <h2 className="section-title text-2xl font-semibold">
              {t("habit.section.title")}
            </h2>
            <p className="section-muted max-w-2xl text-sm leading-6">
              {t("habit.section.description")}
            </p>
          </div>
          <div className="accent-badge inline-flex items-center gap-2 self-start rounded-md px-3 py-2 text-sm font-semibold">
            {t("habit.statusToday", {
              completed: summary.completedToday,
              total: summary.total,
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label={t("habit.doneTodayCount")}
            value={`${summary.completedToday}/${summary.total}`}
            valueSize="md"
            variant="soft"
          />
          <MetricCard
            label={t("habit.bestStreak")}
            value={`${summary.bestStreak}${t("common.daysShort")}`}
            valueSize="md"
            variant="soft"
          />
          <MetricCard
            label={t("habit.currentBest")}
            value={`${summary.currentStreak}${t("common.daysShort")}`}
            valueSize="md"
            variant="soft"
          />
        </div>

        <HabitForm onAddHabit={onAddHabit} />
      </div>

      <div className="p-4 sm:p-5">
        {habits.length > 0 ? (
          <ul className="grid gap-3">
            {habits.map((habit) => (
              <HabitRow
                habit={habit}
                key={habit.id}
                onDeleteHabit={onDeleteHabit}
                onResetHabit={onResetHabit}
                onToggleToday={onToggleToday}
                todayKey={todayKey}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            action={
              <span className="accent-badge rounded-md px-3 py-2 text-sm font-semibold">
                {t("habit.addFirst")}
              </span>
            }
            description={t("habit.empty.description")}
            icon="flame"
            title={t("habit.empty.title")}
          />
        )}
      </div>
    </section>
  );
}
