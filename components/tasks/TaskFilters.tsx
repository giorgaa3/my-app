"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { getFilterLabelKey } from "@/lib/i18n";
import { getTaskFilterCount } from "@/lib/tasks";
import type { Task, TaskFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

type TaskFiltersProps = {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  tasks: Task[];
  todayKey: string;
};

const filters: Array<{ value: TaskFilter }> = [
  { value: "all" },
  { value: "active" },
  { value: "completed" },
  { value: "overdue" },
  { value: "high" },
];

export function TaskFilters({
  filter,
  onFilterChange,
  onSearchChange,
  searchQuery,
  tasks,
  todayKey,
}: TaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3">
      <label className="relative block">
        <span className="sr-only">{t("task.search")}</span>
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
        />
        <input
          className="field-control w-full rounded-lg py-2 pl-10 pr-4 text-sm"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("task.searchPlaceholder")}
          value={searchQuery}
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => {
          const count = getTaskFilterCount(tasks, item.value, todayKey);

          return (
            <button
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                filter === item.value
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--foreground)]",
              )}
              key={item.value}
              onClick={() => onFilterChange(item.value)}
              type="button"
            >
              {t(getFilterLabelKey(item.value))}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-xs",
                  filter === item.value
                    ? "bg-white/20 text-white"
                    : "bg-[var(--surface)] text-[var(--muted)]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
