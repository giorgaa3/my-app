"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { TaskSection } from "@/components/tasks/TaskSection";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import { TASK_REWARDS } from "@/lib/lifequest";

export function TasksView() {
  const {
    addTask,
    deleteTask,
    setTaskFilter,
    taskFilter,
    taskSummary,
    tasks,
    todayKey,
    toggleTask,
    updateTask,
  } = useLifeQuest();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="spark" className="h-4 w-4" />
            {t("task.rewardMedium", { xp: TASK_REWARDS.medium.xp })}
          </div>
        }
        description={t("task.description")}
        eyebrow={t("task.eyebrow")}
        title={t("task.title")}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t("task.metric.total")} value={taskSummary.total} />
        <MetricCard label={t("task.metric.active")} value={taskSummary.active} />
        <MetricCard
          label={t("task.metric.completed")}
          value={taskSummary.completed}
        />
        <MetricCard
          label={t("task.metric.overdue")}
          value={taskSummary.overdue}
        />
      </section>

      <TaskSection
        filter={taskFilter}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
        onFilterChange={setTaskFilter}
        onToggleTask={toggleTask}
        onUpdateTask={updateTask}
        tasks={tasks}
        todayKey={todayKey}
      />
    </div>
  );
}
