import type { ReactNode } from "react";

type PageHeaderProps = {
  action?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHeader({
  action,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="section-muted text-sm font-semibold uppercase">
          {eyebrow}
        </p>
        <h1 className="section-title mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
          {title}
        </h1>
        <p className="section-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
