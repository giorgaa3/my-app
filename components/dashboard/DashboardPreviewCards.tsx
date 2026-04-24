"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { isHabitCompletedToday } from "@/lib/habits";
import {
  getDailyQuestTitleKey,
  getLifeAreaLabelKey,
  getPriorityLabelKey,
} from "@/lib/i18n";
import { formatFriendlyDate } from "@/lib/date";
import { isTaskOverdue } from "@/lib/tasks";
import type { DailyQuest, Habit, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type OverviewCardProps = {
  detail: string;
  icon: "flame" | "list" | "target" | "trend";
  label: string;
  value: number | string;
};

export function OverviewCard({
  detail,
  icon,
  label,
  value,
}: OverviewCardProps) {
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

export function QuestPreviewCard({ quest }: { quest: DailyQuest }) {
  const { t } = useLanguage();
  const progress = Math.min(
    100,
    Math.round((quest.progress / quest.target) * 100),
  );

  return (
    <article className="soft-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-title text-sm font-semibold">
            {t(getDailyQuestTitleKey(quest.id))}
          </p>
          <p className="section-muted mt-1 text-xs font-semibold">
            {t("quest.rewardText", {
              coins: quest.reward.coins,
              xp: quest.reward.xp,
            })}
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

export function TaskPreviewCard({
  task,
  todayKey,
}: {
  task: Task;
  todayKey: string;
}) {
  const { t } = useLanguage();

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
            {t(getLifeAreaLabelKey(task.category))} /{" "}
            {getTranslatedDueDateLabel(task, todayKey, t)}
          </p>
        </div>
        <span className="accent-badge shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
          {t(getPriorityLabelKey(task.priority))}
        </span>
      </div>
    </article>
  );
}

export function HabitPreviewCard({
  habit,
  todayKey,
}: {
  habit: Habit;
  todayKey: string;
}) {
  const { t } = useLanguage();
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
          {t(getLifeAreaLabelKey(habit.category))}
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
        {completedToday ? t("common.done") : t("common.open")}
      </span>
    </article>
  );
}

function getTranslatedDueDateLabel(
  task: Task,
  todayKey: string,
  t: ReturnType<typeof useLanguage>["t"],
) {
  if (!task.dueDate) {
    return t("date.noDueDate");
  }

  if (task.dueDate === todayKey) {
    return t("date.dueToday");
  }

  if (isTaskOverdue(task, todayKey)) {
    return t("date.overdueSince", {
      date: formatFriendlyDate(task.dueDate),
    });
  }

  return t("date.due", { date: formatFriendlyDate(task.dueDate) });
}

export function InlineEmptyState({
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
