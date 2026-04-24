import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
