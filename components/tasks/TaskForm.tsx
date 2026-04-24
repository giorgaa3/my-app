"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Icon } from "@/components/ui/Icon";
import { taskPriorityOptions } from "@/lib/tasks";
import type { Task, TaskInput, TaskPriority } from "@/lib/types";

type TaskFormProps = {
  editingTask: Task | null;
  onAddTask: (task: TaskInput) => void;
  onCancelEdit: () => void;
  onUpdateTask: (taskId: string, task: TaskInput) => void;
};

export function TaskForm({
  editingTask,
  onAddTask,
  onCancelEdit,
  onUpdateTask,
}: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? "medium",
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? "");
  const isEditing = Boolean(editingTask);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const taskInput: TaskInput = {
      dueDate: dueDate || undefined,
      priority,
      title: title.trim(),
    };

    if (editingTask) {
      onUpdateTask(editingTask.id, taskInput);
    } else {
      onAddTask(taskInput);
    }

    setTitle("");
    setPriority("medium");
    setDueDate("");
  }

  return (
    <form
      className="mt-5 grid gap-3 lg:grid-cols-[1fr_150px_160px_auto]"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Task title
        </span>
        <input
          className="field-control rounded-lg px-4 text-sm"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Finish portfolio case study"
          value={title}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Priority
        </span>
        <select
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          value={priority}
        >
          {taskPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Due date
        </span>
        <input
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
      </label>

      <div className="flex items-end gap-2">
        <button
          className="primary-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:translate-y-0 disabled:opacity-45 lg:flex-none"
          disabled={!title.trim()}
          type="submit"
        >
          <Icon name={isEditing ? "save" : "plus"} className="h-4 w-4" />
          {isEditing ? "Save task" : "Add task"}
        </button>
        {isEditing ? (
          <button
            className="icon-button inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold transition"
            onClick={onCancelEdit}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
