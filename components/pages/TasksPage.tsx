"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { TaskSection } from "@/components/tasks/TaskSection";
import { Icon } from "@/components/ui/Icon";
import { TASK_REWARDS } from "@/lib/lifequest";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";

export function TasksPage() {
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="spark" className="h-4 w-4" />
            +{TASK_REWARDS.medium.xp} XP for a medium quest
          </div>
        }
        description="Add, edit, search, filter, complete, and delete tasks from one focused board. Completing tasks rewards XP and coins automatically."
        eyebrow="Tasks"
        title="Quest log"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TaskMetric label="Total" value={taskSummary.total} />
        <TaskMetric label="Active" value={taskSummary.active} />
        <TaskMetric label="Completed" value={taskSummary.completed} />
        <TaskMetric label="Overdue" value={taskSummary.overdue} />
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

function TaskMetric({ label, value }: { label: string; value: number }) {
  return (
    <article className="dashboard-card rounded-2xl p-4">
      <p className="section-muted text-sm font-semibold">{label}</p>
      <p className="section-title mt-2 text-3xl font-semibold">{value}</p>
    </article>
  );
}
