import { StatCard } from "@/components/ui/StatCard";
import type { DashboardStats } from "@/lib/types";

type StatsGridProps = {
  stats: DashboardStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <StatCard
        detail="Everything currently on your task board."
        icon="list"
        label="Total tasks"
        tone="blue"
        value={String(stats.totalTasks)}
      />
      <StatCard
        detail="Tasks moved across the finish line."
        icon="checkCircle"
        label="Completed tasks"
        tone="teal"
        value={String(stats.completedTasks)}
      />
      <StatCard
        detail="Routines available to check off today."
        icon="flame"
        label="Active habits"
        tone="amber"
        value={String(stats.activeHabits)}
      />
      <StatCard
        detail="Progress across all tracked tasks."
        icon="trend"
        label="Completion"
        tone="teal"
        value={`${stats.completionPercentage}%`}
      />
      <StatCard
        detail="Tasks that need attention before today ends."
        icon="alert"
        label="Overdue"
        tone="rose"
        value={String(stats.overdueTasks)}
      />
      <StatCard
        detail="Work marked as the highest priority."
        icon="flag"
        label="High priority"
        tone="blue"
        value={String(stats.highPriorityTasks)}
      />
    </section>
  );
}
