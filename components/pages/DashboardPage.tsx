"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getAchievements, getDailyQuests, getLevelInfo } from "@/lib/lifequest";
import { isHabitCompletedToday } from "@/lib/habits";
import { getDueDateLabel, isTaskOverdue } from "@/lib/tasks";
import type { DailyQuest, Habit, Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function DashboardPage() {
  const {
    habitSummary,
    habits,
    profile,
    stats,
    taskSummary,
    tasks,
    todayKey,
  } = useLifeQuest();
  const levelInfo = getLevelInfo(profile.xp);
  const quests = getDailyQuests(profile, tasks, habits, todayKey);
  const completedQuests = quests.filter((quest) => quest.completed).length;
  const recentAchievements = getAchievements(profile, todayKey)
    .filter((achievement) => achievement.unlocked)
    .slice(0, 3);
  const taskPreview = tasks.filter((task) => !task.completed).slice(0, 4);
  const habitPreview = habits.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <Link
            className="primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
            href="/tasks"
          >
            <Icon name="plus" className="h-4 w-4" />
            Add quest
          </Link>
        }
        description="A cleaner command center for your real-life progress. Manage the details from dedicated pages, then come back here to scan what matters."
        eyebrow="Dashboard"
        title="Your LifeQuest overview"
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="dashboard-card hero-panel rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="accent-badge inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold">
                <Icon name="spark" className="h-4 w-4" />
                Today’s route
              </div>
              <h2 className="section-title mt-5 text-3xl font-semibold sm:text-4xl">
                Level up without opening every panel.
              </h2>
              <p className="section-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                Finish a task, check a habit, or run a focus session. LifeQuest
                turns those actions into XP, coins, streaks, and achievements.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <HeroMetric label="Active tasks" value={taskSummary.active} />
                <HeroMetric
                  label="Habits today"
                  value={`${habitSummary.completedToday}/${habitSummary.total}`}
                />
                <HeroMetric
                  label="Daily quests"
                  value={`${completedQuests}/${quests.length}`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-5xl">
                {levelInfo.avatar}
              </div>
              <p className="section-title mt-4 text-2xl font-semibold">
                Level {levelInfo.level}
              </p>
              <p className="section-muted text-sm font-semibold">
                {levelInfo.title}
              </p>
              <div className="progress-track mt-4">
                <div
                  className="progress-bar"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
              <p className="section-muted mt-2 text-xs font-medium">
                {levelInfo.xpToNextLevel} XP to next level
              </p>
            </div>
          </div>
        </article>

        <article className="lifequest-card rounded-2xl p-5">
          <p className="text-sm font-semibold uppercase text-white/70">
            Character summary
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <CharacterMetric label="Total XP" value={profile.xp} />
            <CharacterMetric label="Coins" value={profile.coins} />
            <CharacterMetric
              label="Tasks done"
              value={profile.totalTaskCompletions}
            />
            <CharacterMetric
              label="Focus wins"
              value={profile.completedFocusSessions}
            />
          </div>
          <Link
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            href="/profile"
          >
            <Icon name="flag" className="h-4 w-4" />
            View profile
          </Link>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          detail="Everything on your task board."
          icon="list"
          label="Total tasks"
          value={stats.totalTasks}
        />
        <OverviewCard
          detail="Tasks that still need action."
          icon="target"
          label="Active tasks"
          value={taskSummary.active}
        />
        <OverviewCard
          detail="Routines checked in today."
          icon="flame"
          label="Habits today"
          value={`${habitSummary.completedToday}/${habitSummary.total}`}
        />
        <OverviewCard
          detail="Current task completion rate."
          icon="trend"
          label="Completion"
          value={`${stats.completionPercentage}%`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PreviewPanel
          description="A short look at today’s quest progress."
          href="/quests"
          linkLabel="Open quests"
          title="Daily quest preview"
        >
          <div className="grid gap-3">
            {quests.slice(0, 3).map((quest) => (
              <QuestPreviewCard key={quest.id} quest={quest} />
            ))}
          </div>
        </PreviewPanel>

        <PreviewPanel
          description="Unlocked badges appear here as proof of momentum."
          href="/achievements"
          linkLabel="View rewards"
          title="Recent achievements"
        >
          {recentAchievements.length > 0 ? (
            <div className="grid gap-3">
              {recentAchievements.map((achievement) => (
                <div
                  className="soft-card flex items-start gap-3 rounded-2xl p-4"
                  key={achievement.id}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="section-title text-sm font-semibold">
                      {achievement.title}
                    </p>
                    <p className="section-muted mt-1 text-sm leading-5">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon="checkCircle"
              text="Complete one task or focus session to unlock your first badge."
            />
          )}
        </PreviewPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <PreviewPanel
          description="The full task board lives on its own page now."
          href="/tasks"
          linkLabel="Manage tasks"
          title="Task preview"
        >
          {taskPreview.length > 0 ? (
            <div className="grid gap-3">
              {taskPreview.map((task) => (
                <TaskPreviewCard key={task.id} task={task} todayKey={todayKey} />
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon="list"
              text="No active tasks. Add a quest when you’re ready."
            />
          )}
        </PreviewPanel>

        <PreviewPanel
          description="Check-ins, resets, and weekly progress are on the habits page."
          href="/habits"
          linkLabel="Manage habits"
          title="Habit preview"
        >
          {habitPreview.length > 0 ? (
            <div className="grid gap-3">
              {habitPreview.map((habit) => (
                <HabitPreviewCard
                  habit={habit}
                  key={habit.id}
                  todayKey={todayKey}
                />
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon="flame"
              text="No habits yet. Create a small routine to start a streak."
            />
          )}
        </PreviewPanel>
      </section>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="soft-card rounded-2xl px-4 py-3">
      <p className="section-muted text-sm font-medium">{label}</p>
      <p className="section-title mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function CharacterMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-white/60">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function OverviewCard({
  detail,
  icon,
  label,
  value,
}: {
  detail: string;
  icon: "flame" | "list" | "target" | "trend";
  label: string;
  value: number | string;
}) {
  return (
    <article className="dashboard-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-muted text-sm font-semibold">{label}</p>
          <p className="section-title mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--brand)]">
          <Icon name={icon} className="h-4 w-4" />
        </div>
      </div>
      <p className="section-muted mt-4 text-sm leading-5">{detail}</p>
    </article>
  );
}

function PreviewPanel({
  children,
  description,
  href,
  linkLabel,
  title,
}: {
  children: ReactNode;
  description: string;
  href: string;
  linkLabel: string;
  title: string;
}) {
  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title text-xl font-semibold">{title}</h2>
          <p className="section-muted mt-1 text-sm leading-5">{description}</p>
        </div>
        <Link
          className="icon-button inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold transition"
          href={href}
        >
          {linkLabel}
        </Link>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function QuestPreviewCard({ quest }: { quest: DailyQuest }) {
  const progress = Math.min(
    100,
    Math.round((quest.progress / quest.target) * 100),
  );

  return (
    <article className="soft-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-title text-sm font-semibold">{quest.title}</p>
          <p className="section-muted mt-1 text-xs font-semibold">
            +{quest.reward.xp} XP · +{quest.reward.coins} coins
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            quest.claimed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[var(--surface)] text-[var(--muted)]",
          )}
        >
          {Math.min(quest.progress, quest.target)}/{quest.target}
        </span>
      </div>
      <div className="progress-track mt-3">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

function TaskPreviewCard({
  task,
  todayKey,
}: {
  task: Task;
  todayKey: string;
}) {
  return (
    <article
      className={cn(
        "soft-card rounded-2xl p-4",
        isTaskOverdue(task, todayKey) && "attention-row",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="section-title truncate text-sm font-semibold">
            {task.title}
          </p>
          <p className="section-muted mt-1 text-xs font-semibold">
            {task.category} · {getDueDateLabel(task, todayKey)}
          </p>
        </div>
        <span className="accent-badge shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
          {task.priority}
        </span>
      </div>
    </article>
  );
}

function HabitPreviewCard({
  habit,
  todayKey,
}: {
  habit: Habit;
  todayKey: string;
}) {
  const completedToday = isHabitCompletedToday(habit, todayKey);

  return (
    <article className="soft-card flex items-center gap-3 rounded-2xl p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-xl shadow-sm">
        {habit.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="section-title truncate text-sm font-semibold">
          {habit.name}
        </p>
        <p className="section-muted mt-1 text-xs font-semibold">
          {habit.category}
        </p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          completedToday
            ? "bg-emerald-100 text-emerald-700"
            : "bg-[var(--surface)] text-[var(--muted)]",
        )}
      >
        {completedToday ? "Done" : "Open"}
      </span>
    </article>
  );
}

function EmptyPreview({
  icon,
  text,
}: {
  icon: "checkCircle" | "flame" | "list";
  text: string;
}) {
  return (
    <div className="soft-card flex items-center gap-3 rounded-2xl p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand)] shadow-sm">
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <p className="section-muted text-sm leading-5">{text}</p>
    </div>
  );
}
