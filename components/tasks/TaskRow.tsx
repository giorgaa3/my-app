"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import {
  getLifeAreaLabelKey,
  getPriorityLabelKey,
} from "@/lib/i18n";
import { formatFriendlyDate } from "@/lib/date";
import { getLifeAreaOption } from "@/lib/lifeAreas";
import {
  isTaskOverdue,
  priorityStyles,
} from "@/lib/tasks";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type TaskRowProps = {
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  task: Task;
  todayKey: string;
};

export function TaskRow({
  onDeleteTask,
  onEditTask,
  onToggleTask,
  task,
  todayKey,
}: TaskRowProps) {
  const overdue = isTaskOverdue(task, todayKey);
  const priority = priorityStyles[task.priority];
  const lifeArea = getLifeAreaOption(task.category);
  const { t } = useLanguage();

  return (
    <li
      className={cn(
        "group border-b border-[var(--border)] px-4 py-4 transition last:border-b-0 hover:bg-[var(--surface-muted)]",
        overdue && "attention-row",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          aria-label={
            task.completed
              ? t("aria.markTaskActive")
              : t("aria.markTaskComplete")
          }
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-4 focus:ring-teal-100",
            task.completed
              ? "border-teal-500 bg-teal-500 text-white"
              : "border-[var(--border)] bg-[var(--surface)] text-transparent hover:border-teal-400",
          )}
          onClick={() => onToggleTask(task.id)}
          type="button"
        >
          <Icon name="check" className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={cn(
                "min-w-0 max-w-full break-words text-sm font-semibold",
                task.completed
                  ? "section-muted line-through"
                  : "section-title",
              )}
            >
              {task.title}
            </p>
            {overdue ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                <Icon name="alert" className="h-3.5 w-3.5" />
                {t("common.overdue")}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold",
                priority.badge,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", priority.dot)} />
              {t(getPriorityLabelKey(task.priority))}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              {getTranslatedDueDateLabel(task, todayKey, t)}
            </span>
            <span className="inline-flex rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
              {task.completed ? t("common.completed") : t("common.active")}
            </span>
            <span className="accent-badge inline-flex rounded-md px-2 py-1 text-xs font-semibold">
              {lifeArea.emoji} {t(getLifeAreaLabelKey(lifeArea.area))}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start">
          <button
            aria-label={t("aria.editTask", { title: task.title })}
            className="icon-button flex h-9 w-9 items-center justify-center rounded-md transition"
            onClick={() => onEditTask(task)}
            type="button"
          >
            <Icon name="edit" className="h-4 w-4" />
          </button>
          <button
            aria-label={t("aria.deleteTask", { title: task.title })}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted)] transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
            onClick={() => onDeleteTask(task.id)}
            type="button"
          >
            <Icon name="trash" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
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
