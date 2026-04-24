"use client";

import { AchievementsPanel } from "@/components/lifequest/AchievementsPanel";
import { RewardShop } from "@/components/lifequest/RewardShop";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { getAchievements, getRewardItems } from "@/lib/lifequest";

export function AchievementsView() {
  const { profile, todayKey } = useLifeQuest();
  const { t } = useLanguage();
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
            {t("achievements.badgesUnlocked", { count: unlockedAchievements })}
          </div>
        }
        description={t("achievements.description")}
        eyebrow={t("achievements.eyebrow")}
        title={t("achievements.title")}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("achievements.metric.achievements")}
          value={`${unlockedAchievements}/${achievements.length}`}
        />
        <MetricCard
          label={t("achievements.metric.rewards")}
          value={`${unlockedRewards}/${rewards.length}`}
        />
        <MetricCard label={t("achievements.metric.coins")} value={profile.coins} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <AchievementsPanel profile={profile} todayKey={todayKey} />
        <RewardShop profile={profile} />
      </div>
    </div>
  );
}
