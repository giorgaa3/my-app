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
    <div className="soft-card flex flex-col items-center justify-center rounded-lg border-dashed px-5 py-10 text-center">
      <div className="dashboard-card flex h-11 w-11 items-center justify-center rounded-lg text-[var(--brand)] shadow-none">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="section-title mt-4 text-sm font-semibold">{title}</h3>
      <p className="section-muted mt-1 max-w-xs text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
