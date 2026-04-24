"use client";

import { CharacterCard } from "@/components/lifequest/CharacterCard";
import { LifeAreasGrid } from "@/components/lifequest/LifeAreasGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Icon } from "@/components/ui/Icon";
import { getDailyStreak, getLevelInfo } from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function ProfilePage() {
  const { habits, profile, stats, tasks, todayKey } = useLifeQuest();
  const levelInfo = getLevelInfo(profile.xp);
  const dailyStreak = getDailyStreak(profile.activeDates, todayKey);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="flag" className="h-4 w-4" />
            Level {levelInfo.level} · {levelInfo.title}
          </div>
        }
        description="Your character card, XP progress, coins, streak, and the main stats that describe your current LifeQuest build."
        eyebrow="Profile / Character"
        title="Character sheet"
      />

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <CharacterCard profile={profile} todayKey={todayKey} />

        <section className="dashboard-card rounded-2xl p-5">
          <p className="section-muted text-sm font-semibold uppercase">
            Main stats
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            Progress snapshot
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ProfileStat label="Total XP" value={profile.xp} />
            <ProfileStat label="Coins" value={profile.coins} />
            <ProfileStat label="Daily streak" value={`${dailyStreak}d`} />
            <ProfileStat
              label="Focus sessions"
              value={profile.completedFocusSessions}
            />
            <ProfileStat
              label="Tasks completed"
              value={profile.totalTaskCompletions}
            />
            <ProfileStat
              label="Habit check-ins"
              value={profile.totalHabitCompletions}
            />
          </div>
        </section>
      </div>

      <StatsGrid stats={stats} />
      <LifeAreasGrid habits={habits} tasks={tasks} todayKey={todayKey} />
    </div>
  );
}

function ProfileStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="soft-card rounded-2xl px-4 py-3">
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p className="section-title mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
