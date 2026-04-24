import { cn } from "@/lib/utils";

type MetricCardProps = {
  className?: string;
  detail?: string;
  label: string;
  value: number | string;
  valueSize?: "md" | "lg";
  variant?: "card" | "soft";
};

export function MetricCard({
  className,
  detail,
  label,
  value,
  valueSize = "lg",
  variant = "card",
}: MetricCardProps) {
  return (
    <article
      className={cn(
        variant === "card" ? "dashboard-card" : "soft-card",
        "rounded-2xl p-4",
        className,
      )}
    >
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p
        className={cn(
          "section-title mt-2 font-semibold",
          valueSize === "lg" ? "text-3xl" : "text-2xl",
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className="section-muted mt-3 text-sm leading-5">{detail}</p>
      ) : null}
    </article>
  );
}
