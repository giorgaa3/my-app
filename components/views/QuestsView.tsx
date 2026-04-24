"use client";

import { DailyQuestBoard } from "@/components/lifequest/DailyQuestBoard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { getDailyQuests } from "@/lib/lifequest";

export function QuestsView() {
  const { habits, profile, tasks, todayKey } = useLifeQuest();
  const { t } = useLanguage();
  const quests = getDailyQuests(profile, tasks, habits, todayKey);
  const completedCount = quests.filter((quest) => quest.completed).length;
  const claimedCount = quests.filter((quest) => quest.claimed).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="target" className="h-4 w-4" />
            {t("common.completeStatus", {
              completed: completedCount,
              total: quests.length,
            })}
          </div>
        }
        description={t("quest.description")}
        eyebrow={t("quest.eyebrow")}
        title={t("quest.title")}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("quest.metric.completed")}
          value={`${completedCount}/${quests.length}`}
          valueSize="md"
        />
        <MetricCard
          label={t("quest.metric.rewardsClaimed")}
          value={`${claimedCount}/${quests.length}`}
          valueSize="md"
        />
        <MetricCard
          label={t("quest.metric.dateKey")}
          value={todayKey}
          valueSize="md"
        />
      </section>

      <DailyQuestBoard
        habits={habits}
        profile={profile}
        tasks={tasks}
        todayKey={todayKey}
      />
    </div>
  );
}
