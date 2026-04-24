"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { getLifeAreaLabelKey, getPriorityLabelKey } from "@/lib/i18n";
import { lifeAreaOptions } from "@/lib/lifeAreas";
import { taskPriorityOptions } from "@/lib/tasks";
import type { LifeArea, Task, TaskInput, TaskPriority } from "@/lib/types";

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
  const [category, setCategory] = useState<LifeArea>(
    editingTask?.category ?? "Work",
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? "");
  const isEditing = Boolean(editingTask);
  const { t } = useLanguage();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const taskInput: TaskInput = {
      category,
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
    setCategory("Work");
    setDueDate("");
  }

  return (
    <form
      className="mt-5 grid gap-3 md:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1.5 md:col-span-2">
        <span className="section-muted text-xs font-semibold uppercase">
          {t("task.form.title")}
        </span>
        <input
          className="field-control rounded-lg px-4 text-sm"
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("task.form.placeholder")}
          value={title}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          {t("task.form.priority")}
        </span>
        <select
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          value={priority}
        >
          {taskPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(getPriorityLabelKey(option.value))}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          {t("task.form.lifeArea")}
        </span>
        <select
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setCategory(event.target.value as LifeArea)}
          value={category}
        >
          {lifeAreaOptions.map((option) => (
            <option key={option.area} value={option.area}>
              {option.emoji} {t(getLifeAreaLabelKey(option.area))}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          {t("task.form.dueDate")}
        </span>
        <input
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
      </label>

      <div className="flex flex-col items-stretch gap-2 md:col-span-2 sm:flex-row">
        <button
          className="primary-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:translate-y-0 disabled:opacity-45"
          disabled={!title.trim()}
          type="submit"
        >
          <Icon name={isEditing ? "save" : "plus"} className="h-4 w-4" />
          {isEditing ? t("common.saveTask") : t("common.addTask")}
        </button>
        {isEditing ? (
          <button
            className="icon-button inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold transition"
            onClick={onCancelEdit}
            type="button"
          >
            {t("common.cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
