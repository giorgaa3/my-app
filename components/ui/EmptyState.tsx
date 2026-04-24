import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ action, icon, title, description }: EmptyStateProps) {
  return (
    <div className="soft-card relative overflow-hidden rounded-lg border-dashed px-5 py-10 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgb(59_130_246/0.12),rgb(124_58_237/0.12),rgb(16_185_129/0.12))]" />
      <div className="relative flex flex-col items-center justify-center">
      <div className="dashboard-card flex h-12 w-12 items-center justify-center rounded-lg text-[var(--brand)] shadow-none">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="section-title mt-4 text-sm font-semibold">{title}</h3>
      <p className="section-muted mt-1 max-w-xs text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
