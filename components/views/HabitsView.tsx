"use client";

import { HabitSection } from "@/components/habits/HabitSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { HABIT_REWARD } from "@/lib/lifequest";

export function HabitsView() {
  const {
    addHabit,
    deleteHabit,
    habitSummary,
    habits,
    resetHabit,
    todayKey,
    toggleHabitToday,
  } = useLifeQuest();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="flame" className="h-4 w-4" />
            {t("habit.perCheckIn", { xp: HABIT_REWARD.xp })}
          </div>
        }
        description={t("habit.description")}
        eyebrow={t("habit.eyebrow")}
        title={t("habit.title")}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("habit.doneTodayCount")}
          value={`${habitSummary.completedToday}/${habitSummary.total}`}
        />
        <MetricCard
          label={t("habit.bestStreak")}
          value={`${habitSummary.bestStreak}${t("common.daysShort")}`}
        />
        <MetricCard
          label={t("habit.currentBest")}
          value={`${habitSummary.currentStreak}${t("common.daysShort")}`}
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
