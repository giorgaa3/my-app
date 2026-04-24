import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

type StatTone = "teal" | "blue" | "amber" | "rose";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: StatTone;
};

const toneClasses: Record<StatTone, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700",
};

export function StatCard({ label, value, detail, icon, tone }: StatCardProps) {
  return (
    <article className="dashboard-card rounded-lg p-5 transition duration-200 hover:-translate-y-0.5">
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
    </article>
  );
}
