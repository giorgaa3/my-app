"use client";

import Link from "next/link";

import {
  HabitPreviewCard,
  InlineEmptyState,
  OverviewCard,
  QuestPreviewCard,
  TaskPreviewCard,
} from "@/components/dashboard/DashboardPreviewCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { PreviewPanel } from "@/components/ui/PreviewPanel";
import { useLanguage } from "@/hooks/use-language";
import {
  getAchievementDescriptionKey,
  getAchievementTitleKey,
  getLevelTitleKey,
} from "@/lib/i18n";
import { getAchievements, getDailyQuests, getLevelInfo } from "@/lib/lifequest";

export function DashboardView() {
  const {
    habitSummary,
    habits,
    profile,
    stats,
    taskSummary,
    tasks,
    todayKey,
  } = useLifeQuest();
  const { t } = useLanguage();
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
            {t("dashboard.addQuest")}
          </Link>
        }
        description={t("dashboard.description")}
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="dashboard-card hero-panel rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="accent-badge inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold">
                <Icon name="spark" className="h-4 w-4" />
                {t("dashboard.todayRoute")}
              </div>
              <h2 className="section-title mt-5 text-3xl font-semibold sm:text-4xl">
                {t("dashboard.hero.title")}
              </h2>
              <p className="section-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                {t("dashboard.hero.description")}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MetricCard
                  label={t("dashboard.activeTasks")}
                  value={taskSummary.active}
                  valueSize="md"
                  variant="soft"
                />
                <MetricCard
                  label={t("dashboard.habitsToday")}
                  value={`${habitSummary.completedToday}/${habitSummary.total}`}
                  valueSize="md"
                  variant="soft"
                />
                <MetricCard
                  label={t("dashboard.dailyQuests")}
                  value={`${completedQuests}/${quests.length}`}
                  valueSize="md"
                  variant="soft"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-5xl">
                {levelInfo.avatar}
              </div>
              <p className="section-title mt-4 text-2xl font-semibold">
                {t("common.level")} {levelInfo.level}
              </p>
              <p className="section-muted text-sm font-semibold">
                {t(getLevelTitleKey(levelInfo.title))}
              </p>
              <div className="progress-track mt-4">
                <div
                  className="progress-bar"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
              <p className="section-muted mt-2 text-xs font-medium">
                {t("dashboard.nextLevel", { xp: levelInfo.xpToNextLevel })}
              </p>
            </div>
          </div>
        </article>

        <article className="lifequest-card rounded-2xl p-5">
          <p className="text-sm font-semibold uppercase text-white/70">
            {t("dashboard.characterSummary")}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <CharacterMetric label={t("dashboard.totalXp")} value={profile.xp} />
            <CharacterMetric label={t("common.coins")} value={profile.coins} />
            <CharacterMetric
              label={t("dashboard.tasksDone")}
              value={profile.totalTaskCompletions}
            />
            <CharacterMetric
              label={t("dashboard.focusWins")}
              value={profile.completedFocusSessions}
            />
          </div>
          <Link
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            href="/profile"
          >
            <Icon name="flag" className="h-4 w-4" />
            {t("dashboard.viewProfile")}
          </Link>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          detail={t("dashboard.overview.total.detail")}
          icon="list"
          label={t("dashboard.totalTasks")}
          value={stats.totalTasks}
        />
        <OverviewCard
          detail={t("dashboard.overview.active.detail")}
          icon="target"
          label={t("dashboard.activeTasks")}
          value={taskSummary.active}
        />
        <OverviewCard
          detail={t("dashboard.overview.habits.detail")}
          icon="flame"
          label={t("dashboard.habitsToday")}
          value={`${habitSummary.completedToday}/${habitSummary.total}`}
        />
        <OverviewCard
          detail={t("dashboard.overview.completion.detail")}
          icon="trend"
          label={t("dashboard.completion")}
          value={`${stats.completionPercentage}%`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <PreviewPanel
          description={t("dashboard.dailyQuestPreview.description")}
          href="/quests"
          linkLabel={t("preview.openQuests")}
          title={t("dashboard.dailyQuestPreview.title")}
        >
          <div className="grid gap-3">
            {quests.slice(0, 3).map((quest) => (
              <QuestPreviewCard key={quest.id} quest={quest} />
            ))}
          </div>
        </PreviewPanel>

        <PreviewPanel
          description={t("dashboard.recentAchievements.description")}
          href="/achievements"
          linkLabel={t("preview.viewRewards")}
          title={t("dashboard.recentAchievements.title")}
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
                    {t(getAchievementTitleKey(achievement.id))}
                  </p>
                  <p className="section-muted mt-1 text-sm leading-5">
                      {t(getAchievementDescriptionKey(achievement.id))}
                  </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <InlineEmptyState
              icon="checkCircle"
              text={t("dashboard.recentAchievements.empty")}
            />
          )}
        </PreviewPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <PreviewPanel
          description={t("dashboard.taskPreview.description")}
          href="/tasks"
          linkLabel={t("preview.manageTasks")}
          title={t("dashboard.taskPreview.title")}
        >
          {taskPreview.length > 0 ? (
            <div className="grid gap-3">
              {taskPreview.map((task) => (
                <TaskPreviewCard key={task.id} task={task} todayKey={todayKey} />
              ))}
            </div>
          ) : (
            <InlineEmptyState
              icon="list"
              text={t("dashboard.taskPreview.empty")}
            />
          )}
        </PreviewPanel>

        <PreviewPanel
          description={t("dashboard.habitPreview.description")}
          href="/habits"
          linkLabel={t("preview.manageHabits")}
          title={t("dashboard.habitPreview.title")}
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
            <InlineEmptyState
              icon="flame"
              text={t("dashboard.habitPreview.empty")}
            />
          )}
        </PreviewPanel>
      </section>
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
