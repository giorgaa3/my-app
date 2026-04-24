"use client";

import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { CharacterCard } from "@/components/lifequest/CharacterCard";
import { LifeAreasGrid } from "@/components/lifequest/LifeAreasGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { getLevelTitleKey } from "@/lib/i18n";
import { getDailyStreak, getLevelInfo } from "@/lib/lifequest";

export function ProfileView() {
  const { habits, profile, stats, tasks, todayKey } = useLifeQuest();
  const { t } = useLanguage();
  const levelInfo = getLevelInfo(profile.xp);
  const dailyStreak = getDailyStreak(profile.activeDates, todayKey);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="flag" className="h-4 w-4" />
            {t("common.level")} {levelInfo.level} /{" "}
            {t(getLevelTitleKey(levelInfo.title))}
          </div>
        }
        description={t("profile.description")}
        eyebrow={t("profile.eyebrow")}
        title={t("profile.title")}
      />

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <CharacterCard profile={profile} todayKey={todayKey} />

        <section className="dashboard-card rounded-2xl p-5">
          <p className="section-muted text-sm font-semibold uppercase">
            {t("profile.mainStats")}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            {t("profile.progressSnapshot")}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MetricCard
              label={t("dashboard.totalXp")}
              value={profile.xp}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("common.coins")}
              value={profile.coins}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.streak")}
              value={`${dailyStreak}${t("common.daysShort")}`}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.focusSessions")}
              value={profile.completedFocusSessions}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.tasksCompleted")}
              value={profile.totalTaskCompletions}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.habitCheckIns")}
              value={profile.totalHabitCompletions}
              valueSize="md"
              variant="soft"
            />
          </div>
        </section>
      </div>

      <StatsGrid stats={stats} />
      <LifeAreasGrid habits={habits} tasks={tasks} todayKey={todayKey} />
    </div>
  );
}
