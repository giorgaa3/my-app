"use client";

import { FocusArena } from "@/components/lifequest/FocusArena";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import {
  FOCUS_REWARD,
  getFocusSessionsToday,
  getLevelInfo,
} from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function FocusPage() {
  const { completeFocusSession, profile, tasks, todayKey } = useLifeQuest();
  const sessionsToday = getFocusSessionsToday(profile, todayKey);
  const levelInfo = getLevelInfo(profile.xp);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="target" className="h-4 w-4" />
            {sessionsToday} completed today
          </div>
        }
        description="Choose one active task, start a 25-minute session, and earn rewards when the timer completes."
        eyebrow="Focus Arena"
        title="Turn deep work into XP"
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <FocusMetric label="Session reward" value={`+${FOCUS_REWARD.xp} XP`} />
        <FocusMetric label="Coin reward" value={`+${FOCUS_REWARD.coins}`} />
        <FocusMetric label="Current level" value={levelInfo.level} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <FocusArena onCompleteSession={completeFocusSession} tasks={tasks} />

        <aside className="dashboard-card rounded-2xl p-5">
          <p className="section-muted text-sm font-semibold uppercase">
            Arena rules
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            Keep it simple
          </h2>
          <div className="mt-5 grid gap-3">
            <RuleCard
              icon="list"
              text="Pick one unfinished task as the target."
            />
            <RuleCard
              icon="circle"
              text="Pause if you need to step away, then continue."
            />
            <RuleCard
              icon="spark"
              text="A completed session rewards XP, coins, quest progress, and achievement progress."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function FocusMetric({
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

function RuleCard({
  icon,
  text,
}: {
  icon: "circle" | "list" | "spark";
  text: string;
}) {
  return (
    <div className="soft-card flex items-start gap-3 rounded-2xl p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand)]">
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <p className="section-muted text-sm leading-6">{text}</p>
    </div>
  );
}
