"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Task, TaskFilter } from "@/lib/types";

type TaskSectionProps = {
  filter: TaskFilter;
  onAddTask: (title: string) => void;
  onDeleteTask: (taskId: string) => void;
  onFilterChange: (filter: TaskFilter) => void;
  onToggleTask: (taskId: string) => void;
  tasks: Task[];
};

const filters: Array<{ label: string; value: TaskFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export function TaskSection({
  filter,
  onAddTask,
  onDeleteTask,
  onFilterChange,
  onToggleTask,
  tasks,
}: TaskSectionProps) {
  const [taskTitle, setTaskTitle] = useState("");

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddTask(taskTitle);
    setTaskTitle("");
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              Tasks
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Today&apos;s task board
            </h2>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            {filters.map((item) => (
              <button
                className={cn(
                  "h-9 rounded-md px-3 text-sm font-semibold text-slate-600 transition",
                  filter === item.value &&
                    "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200",
                )}
                key={item.value}
                onClick={() => onFilterChange(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <input
            className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Add a focused task"
            value={taskTitle}
          />
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:translate-y-0 disabled:bg-slate-300"
            disabled={!taskTitle.trim()}
            type="submit"
          >
            <Icon name="plus" className="h-4 w-4" />
            Add task
          </button>
        </form>
      </div>

      <div className="p-4 sm:p-5">
        {filteredTasks.length > 0 ? (
          <ul className="overflow-hidden rounded-lg border border-slate-200">
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.id}
                onDeleteTask={onDeleteTask}
                onToggleTask={onToggleTask}
                task={task}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            description={
              filter === "all"
                ? "Add your first task and start shaping the day."
                : "Nothing matches this filter right now."
            }
            icon="list"
            title={filter === "all" ? "No tasks yet" : "No tasks found"}
          />
        )}
      </div>
    </section>
  );
}

type TaskRowProps = {
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  task: Task;
};

function TaskRow({ onDeleteTask, onToggleTask, task }: TaskRowProps) {
  return (
    <li className="group flex items-center gap-3 border-b border-slate-200 px-4 py-3 transition last:border-b-0 hover:bg-slate-50">
      <button
        aria-label={task.completed ? "Mark task active" : "Mark task complete"}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-4 focus:ring-teal-100",
          task.completed
            ? "border-teal-500 bg-teal-500 text-white"
            : "border-slate-300 bg-white text-transparent hover:border-teal-400",
        )}
        onClick={() => onToggleTask(task.id)}
        type="button"
      >
        <Icon name="check" className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            task.completed
              ? "text-slate-400 line-through"
              : "text-slate-950",
          )}
        >
          {task.title}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Added {formatTaskDate(task.createdAt)}
        </p>
      </div>

      <span
        className={cn(
          "hidden rounded-md px-2.5 py-1 text-xs font-semibold sm:inline-flex",
          task.completed
            ? "bg-teal-50 text-teal-700"
            : "bg-amber-50 text-amber-700",
        )}
      >
        {task.completed ? "Completed" : "Active"}
      </span>

      <button
        aria-label={`Delete ${task.title}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
        onClick={() => onDeleteTask(task.id)}
        type="button"
      >
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </li>
  );
}

function formatTaskDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
}
