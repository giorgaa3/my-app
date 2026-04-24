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
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  blue: "border-sky-100 bg-sky-50 text-sky-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  teal: "border-teal-100 bg-teal-50 text-teal-700",
};

export function StatCard({ label, value, detail, icon, tone }: StatCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${toneClasses[tone]}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}
