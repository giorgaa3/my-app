"use client";

import { StatCard } from "@/components/ui/StatCard";
import { useLanguage } from "@/hooks/use-language";
import type { DashboardStats } from "@/lib/types";

type StatsGridProps = {
  stats: DashboardStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useLanguage();

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <StatCard
        detail={t("stat.totalTasks.detail")}
        icon="list"
        label={t("stat.totalTasks.label")}
        progress={stats.totalTasks > 0 ? 100 : 0}
        tone="blue"
        value={String(stats.totalTasks)}
      />
      <StatCard
        detail={t("stat.completedTasks.detail")}
        icon="checkCircle"
        label={t("stat.completedTasks.label")}
        progress={stats.completionPercentage}
        tone="green"
        value={String(stats.completedTasks)}
      />
      <StatCard
        detail={t("stat.activeHabits.detail")}
        icon="flame"
        label={t("stat.activeHabits.label")}
        progress={stats.activeHabits > 0 ? 100 : 0}
        tone="amber"
        value={String(stats.activeHabits)}
      />
      <StatCard
        detail={t("stat.completion.detail")}
        icon="trend"
        label={t("stat.completion.label")}
        progress={stats.completionPercentage}
        tone="teal"
        value={`${stats.completionPercentage}%`}
      />
      <StatCard
        detail={t("stat.overdue.detail")}
        icon="alert"
        label={t("stat.overdue.label")}
        progress={
          stats.totalTasks === 0
            ? 0
            : Math.round((stats.overdueTasks / stats.totalTasks) * 100)
        }
        tone="rose"
        value={String(stats.overdueTasks)}
      />
      <StatCard
        detail={t("stat.highPriority.detail")}
        icon="flag"
        label={t("stat.highPriority.label")}
        progress={
          stats.totalTasks === 0
            ? 0
            : Math.round((stats.highPriorityTasks / stats.totalTasks) * 100)
        }
        tone="purple"
        value={String(stats.highPriorityTasks)}
      />
    </section>
  );
}
