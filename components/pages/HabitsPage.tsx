"use client";

import { HabitSection } from "@/components/habits/HabitSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { HABIT_REWARD } from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function HabitsPage() {
  const {
    addHabit,
    deleteHabit,
    habitSummary,
    habits,
    resetHabit,
    todayKey,
    toggleHabitToday,
  } = useLifeQuest();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="flame" className="h-4 w-4" />
            +{HABIT_REWARD.xp} XP per check-in
          </div>
        }
        description="Build small routines, check them off daily, view weekly progress, reset when needed, and keep streaks easy to understand."
        eyebrow="Habits"
        title="Training routines"
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <HabitMetric
          label="Done today"
          value={`${habitSummary.completedToday}/${habitSummary.total}`}
        />
        <HabitMetric label="Best streak" value={`${habitSummary.bestStreak}d`} />
        <HabitMetric
          label="Current best"
          value={`${habitSummary.currentStreak}d`}
        />
      </section>

      <HabitSection
        habits={habits}
        onAddHabit={addHabit}
        onDeleteHabit={deleteHabit}
        onResetHabit={resetHabit}
        onToggleToday={toggleHabitToday}
        todayKey={todayKey}
      />
    </div>
  );
}

function HabitMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="dashboard-card rounded-2xl p-4">
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p className="section-title mt-2 text-3xl font-semibold">{value}</p>
    </article>
  );
}
