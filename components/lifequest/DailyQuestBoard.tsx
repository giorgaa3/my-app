import { Icon } from "@/components/ui/Icon";
import { getDailyQuests } from "@/lib/lifequest";
import type { Habit, LifeQuestProfile, Task } from "@/lib/types";

type DailyQuestBoardProps = {
  habits: Habit[];
  profile: LifeQuestProfile;
  tasks: Task[];
  todayKey: string;
};

export function DailyQuestBoard({
  habits,
  profile,
  tasks,
  todayKey,
}: DailyQuestBoardProps) {
  const quests = getDailyQuests(profile, tasks, habits, todayKey);
  const completedCount = quests.filter((quest) => quest.completed).length;

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-muted text-sm font-semibold uppercase">
            Daily Quest Board
          </p>
          <h2 className="section-title mt-1 text-2xl font-semibold">
            Today&apos;s XP route
          </h2>
          <p className="section-muted mt-2 max-w-2xl text-sm leading-6">
            Complete real actions to earn XP and coins. Quests reset by date.
          </p>
        </div>
        <span className="accent-badge rounded-md px-3 py-2 text-sm font-semibold">
          {completedCount}/{quests.length} complete
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {quests.map((quest) => {
          const progress = Math.min(
            100,
            Math.round((quest.progress / quest.target) * 100),
          );

          return (
            <article
              className="soft-card rounded-2xl p-4 transition hover:-translate-y-0.5"
              key={quest.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="section-title text-sm font-semibold">
                    {quest.title}
                  </h3>
                  <p className="section-muted mt-1 text-sm leading-5">
                    {quest.description}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand)]">
                  <Icon
                    name={quest.claimed ? "checkCircle" : "target"}
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
                  <span>
                    {Math.min(quest.progress, quest.target)}/{quest.target}
                  </span>
                  <span>
                    +{quest.reward.xp} XP · +{quest.reward.coins} coins
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
                {quest.claimed
                  ? "Reward claimed"
                  : quest.completed
                    ? "Completed"
                    : "In progress"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
