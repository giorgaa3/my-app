import Link from "next/link";
import type { ReactNode } from "react";

type PreviewPanelProps = {
  children: ReactNode;
  description: string;
  href: string;
  linkLabel: string;
  title: string;
};

export function PreviewPanel({
  children,
  description,
  href,
  linkLabel,
  title,
}: PreviewPanelProps) {
  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title text-xl font-semibold">{title}</h2>
          <p className="section-muted mt-1 text-sm leading-5">{description}</p>
        </div>
        <Link
          className="icon-button inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold transition"
          href={href}
        >
          {linkLabel}
        </Link>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
