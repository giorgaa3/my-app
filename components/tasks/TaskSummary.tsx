"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { getTaskSummary } from "@/lib/tasks";
import type { Task } from "@/lib/types";

type TaskSummaryProps = {
  tasks: Task[];
  todayKey: string;
};

export function TaskSummary({ tasks, todayKey }: TaskSummaryProps) {
  const summary = getTaskSummary(tasks, todayKey);
  const completion =
    summary.total === 0
      ? 0
      : Math.round((summary.completed / summary.total) * 100);
  const { t } = useLanguage();

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryPill label={t("task.metric.active")} tone="blue" value={summary.active} />
      <SummaryPill
        label={t("task.metric.completed")}
        progress={completion}
        tone="green"
        value={summary.completed}
      />
      <SummaryPill
        icon={summary.overdue > 0 ? "alert" : undefined}
        label={t("task.metric.overdue")}
        tone="rose"
        value={summary.overdue}
      />
      <SummaryPill
        icon="flag"
        label={t("common.highPriority")}
        tone="purple"
        value={summary.highPriority}
      />
    </div>
  );
}

type SummaryPillProps = {
  icon?: "alert" | "flag";
  label: string;
  progress?: number;
  tone: "blue" | "green" | "purple" | "rose";
  value: number;
};

const toneDotClasses: Record<SummaryPillProps["tone"], string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  rose: "bg-rose-500",
};

function SummaryPill({ icon, label, progress, tone, value }: SummaryPillProps) {
  return (
    <div className="soft-card rounded-lg px-4 py-3 transition hover:-translate-y-0.5">
      <p className="section-muted flex items-center gap-1.5 text-xs font-semibold uppercase">
        {icon ? (
          <Icon name={icon} className="h-3.5 w-3.5" />
        ) : (
          <span className={`h-2 w-2 rounded-full ${toneDotClasses[tone]}`} />
        )}
        {label}
      </p>
      <p className="section-title mt-1 text-xl font-semibold">{value}</p>
      {typeof progress === "number" ? (
        <div className="progress-track mt-3 h-1.5">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  );
}
