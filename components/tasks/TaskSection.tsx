"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { useLanguage } from "@/hooks/use-language";
import { filterTasks } from "@/lib/tasks";
import type { Task, TaskFilter, TaskInput } from "@/lib/types";
import { TaskFilters } from "./TaskFilters";
import { TaskForm } from "./TaskForm";
import { TaskRow } from "./TaskRow";
import { TaskSummary } from "./TaskSummary";

type TaskSectionProps = {
  filter: TaskFilter;
  onAddTask: (task: TaskInput) => void;
  onDeleteTask: (taskId: string) => void;
  onFilterChange: (filter: TaskFilter) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, task: TaskInput) => void;
  tasks: Task[];
  todayKey: string;
};

export function TaskSection({
  filter,
  onAddTask,
  onDeleteTask,
  onFilterChange,
  onToggleTask,
  onUpdateTask,
  tasks,
  todayKey,
}: TaskSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { t } = useLanguage();

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filter, searchQuery, todayKey),
    [filter, searchQuery, tasks, todayKey],
  );

  function handleAddTask(task: TaskInput) {
    onAddTask(task);
  }

  function handleUpdateTask(taskId: string, task: TaskInput) {
    onUpdateTask(taskId, task);
    setEditingTask(null);
  }

  return (
    <section className="dashboard-card overflow-hidden rounded-2xl">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="section-muted text-sm font-semibold uppercase">
              {t("task.eyebrow")}
            </p>
            <h2 className="section-title text-2xl font-semibold">
              {t("task.section.title")}
            </h2>
            <p className="section-muted max-w-2xl text-sm leading-6">
              {t("task.section.description")}
            </p>
          </div>
          <div className="accent-badge inline-flex items-center gap-2 self-start rounded-md px-3 py-2 text-sm font-semibold">
            {t("task.totalBadge", { count: tasks.length })}
          </div>
        </div>

        <TaskSummary tasks={tasks} todayKey={todayKey} />

        <TaskForm
          editingTask={editingTask}
          key={editingTask?.id ?? "new-task"}
          onAddTask={handleAddTask}
          onCancelEdit={() => setEditingTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      </div>

      <div className="px-4 py-4 sm:px-5">
        <TaskFilters
          filter={filter}
          onFilterChange={onFilterChange}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          tasks={tasks}
          todayKey={todayKey}
        />

        <div className="mt-4">
          {filteredTasks.length > 0 ? (
            <ul className="overflow-hidden rounded-2xl border border-[var(--border)]">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  onDeleteTask={onDeleteTask}
                  onEditTask={setEditingTask}
                  onToggleTask={onToggleTask}
                  task={task}
                  todayKey={todayKey}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              action={
                !searchQuery.trim() ? (
                  <span className="accent-badge rounded-md px-3 py-2 text-sm font-semibold">
                    {t("task.addFirst")}
                  </span>
                ) : undefined
              }
              description={
                searchQuery.trim()
                  ? t("task.empty.noMatches.description")
                  : t("task.empty.description")
              }
              icon={searchQuery.trim() ? "search" : "list"}
              title={
                searchQuery.trim()
                  ? t("task.empty.noMatches.title")
                  : t("task.empty.title")
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
