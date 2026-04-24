"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
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
              Tasks
            </p>
            <h2 className="section-title text-2xl font-semibold">
              Plan the work, then clear it
            </h2>
            <p className="section-muted max-w-2xl text-sm leading-6">
              Sort by urgency, search quickly, and update tasks without leaving
              the dashboard.
            </p>
          </div>
          <div className="accent-badge inline-flex items-center gap-2 self-start rounded-md px-3 py-2 text-sm font-semibold">
            {tasks.length} total
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
                    Add your first task above
                  </span>
                ) : undefined
              }
              description={
                searchQuery.trim()
                  ? "Try a different search term or clear the search field."
                  : "Create one focused task, choose a priority, and the dashboard will start filling in."
              }
              icon={searchQuery.trim() ? "search" : "list"}
              title={searchQuery.trim() ? "No matching tasks" : "No tasks yet"}
            />
          )}
        </div>
      </div>
    </section>
  );
}
