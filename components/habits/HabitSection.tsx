"use client";

import { EmptyState } from "@/components/ui/EmptyState";
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

  return (
    <section className="dashboard-card overflow-hidden rounded-lg">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <div className="flex flex-col gap-2">
          <p className="section-muted text-sm font-semibold uppercase">
            Habits
          </p>
          <h2 className="section-title text-2xl font-semibold">
            Keep the streak alive
          </h2>
          <p className="section-muted max-w-2xl text-sm leading-6">
            Track small repeatable routines. The weekly grid makes consistency
            visible without turning it into busywork.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <HabitMetric label="Done today" value={`${summary.completedToday}/${summary.total}`} />
          <HabitMetric label="Best streak" value={`${summary.bestStreak}d`} />
          <HabitMetric label="Current best" value={`${summary.currentStreak}d`} />
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
            description="Create a habit with an emoji and category so the routine is easy to recognize later."
            icon="flame"
            title="No habits yet"
          />
        )}
      </div>
    </section>
  );
}

type HabitMetricProps = {
  label: string;
  value: string;
};

function HabitMetric({ label, value }: HabitMetricProps) {
  return (
    <div className="soft-card rounded-lg px-4 py-3">
      <p className="section-muted text-xs font-semibold uppercase">{label}</p>
      <p className="section-title mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
