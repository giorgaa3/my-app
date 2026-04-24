"use client";

import { AchievementsPanel } from "@/components/lifequest/AchievementsPanel";
import { RewardShop } from "@/components/lifequest/RewardShop";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getAchievements, getRewardItems } from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function AchievementsPage() {
  const { profile, todayKey } = useLifeQuest();
  const achievements = getAchievements(profile, todayKey);
  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;
  const rewards = getRewardItems(profile);
  const unlockedRewards = rewards.filter((reward) => reward.unlocked).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="checkCircle" className="h-4 w-4" />
            {unlockedAchievements} badges unlocked
          </div>
        }
        description="Track proof of progress and preview cosmetic rewards. Rewards stay local for now and unlock from coins and level progress."
        eyebrow="Achievements / Rewards"
        title="Badges and unlocks"
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <AchievementMetric
          label="Achievements"
          value={`${unlockedAchievements}/${achievements.length}`}
        />
        <AchievementMetric
          label="Reward cards"
          value={`${unlockedRewards}/${rewards.length}`}
        />
        <AchievementMetric label="Coins" value={profile.coins} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <AchievementsPanel profile={profile} todayKey={todayKey} />
        <RewardShop profile={profile} />
      </div>
    </div>
  );
}

function AchievementMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <article className="dashboard-card rounded-2xl p-4">
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p className="section-title mt-2 text-3xl font-semibold">{value}</p>
    </article>
  );
}
