import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

type StatTone = "teal" | "blue" | "amber" | "rose" | "purple" | "green";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  progress?: number;
  tone: StatTone;
};

const toneClasses: Record<StatTone, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700",
};

const progressClasses: Record<StatTone, string> = {
  amber: "bg-amber-500",
  blue: "bg-sky-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
};

export function StatCard({
  label,
  value,
  detail,
  icon,
  progress,
  tone,
}: StatCardProps) {
  return (
    <article className="dashboard-card rounded-lg p-5 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-muted text-sm font-medium">{label}</p>
          <p className="section-title mt-3 text-3xl font-semibold">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${toneClasses[tone]}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
      <p className="section-muted mt-4 text-sm leading-6">{detail}</p>
      {typeof progress === "number" ? (
        <div className="progress-track mt-4">
          <div
            className={`h-full rounded-full ${progressClasses[tone]}`}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}
