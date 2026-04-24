import { Icon } from "@/components/ui/Icon";
import { getTaskSummary } from "@/lib/tasks";
import type { Task } from "@/lib/types";

type TaskSummaryProps = {
  tasks: Task[];
  todayKey: string;
};

export function TaskSummary({ tasks, todayKey }: TaskSummaryProps) {
  const summary = getTaskSummary(tasks, todayKey);

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryPill label="Active" value={summary.active} />
      <SummaryPill label="Completed" value={summary.completed} />
      <SummaryPill
        icon={summary.overdue > 0 ? "alert" : undefined}
        label="Overdue"
        value={summary.overdue}
      />
      <SummaryPill icon="flag" label="High priority" value={summary.highPriority} />
    </div>
  );
}

type SummaryPillProps = {
  icon?: "alert" | "flag";
  label: string;
  value: number;
};

function SummaryPill({ icon, label, value }: SummaryPillProps) {
  return (
    <div className="soft-card rounded-lg px-4 py-3">
      <p className="section-muted flex items-center gap-1.5 text-xs font-semibold uppercase">
        {icon ? <Icon name={icon} className="h-3.5 w-3.5" /> : null}
        {label}
      </p>
      <p className="section-title mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
