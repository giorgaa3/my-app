"use client";

import { DailyQuestBoard } from "@/components/lifequest/DailyQuestBoard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getDailyQuests } from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function QuestsPage() {
  const { habits, profile, tasks, todayKey } = useLifeQuest();
  const quests = getDailyQuests(profile, tasks, habits, todayKey);
  const completedCount = quests.filter((quest) => quest.completed).length;
  const claimedCount = quests.filter((quest) => quest.claimed).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="target" className="h-4 w-4" />
            {completedCount}/{quests.length} complete
          </div>
        }
        description="Daily quests reset by date and reward XP plus coins automatically when your tasks, habits, and focus sessions meet the conditions."
        eyebrow="Daily Quests"
        title="Today’s reward board"
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <QuestMetric label="Completed" value={`${completedCount}/${quests.length}`} />
        <QuestMetric label="Rewards claimed" value={`${claimedCount}/${quests.length}`} />
        <QuestMetric label="Date key" value={todayKey} />
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

function QuestMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <article className="dashboard-card rounded-2xl p-4">
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p className="section-title mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}
