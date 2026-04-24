import { formatFriendlyDate, getTodayKey, isDateBefore } from "@/lib/date";
import type { Task, TaskFilter, TaskPriority } from "@/lib/types";

export const taskPriorityOptions: Array<{
  label: string;
  value: TaskPriority;
  description: string;
}> = [
  { description: "Nice to finish", label: "Low", value: "low" },
  { description: "Needs attention", label: "Medium", value: "medium" },
  { description: "Protect this first", label: "High", value: "high" },
];

export const priorityStyles: Record<
  TaskPriority,
  {
    badge: string;
    dot: string;
    label: string;
  }
> = {
  high: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    label: "High",
  },
  low: {
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
    label: "Low",
  },
  medium: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    label: "Medium",
  },
};

type StoredTask = Partial<Task> & {
  id: string;
  priority?: TaskPriority;
  title: string;
};

export function normalizeTasks(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((task): task is StoredTask => {
      if (!task || typeof task !== "object") {
        return false;
      }

      const storedTask = task as Partial<StoredTask>;
      return Boolean(storedTask.id && storedTask.title);
    })
    .map((task) => ({
      completed: Boolean(task.completed),
      createdAt: task.createdAt ?? new Date().toISOString(),
      dueDate: task.dueDate || undefined,
      id: String(task.id),
      priority: task.priority ?? "medium",
      title: String(task.title),
    }));
}

export function isTaskOverdue(task: Task, todayKey = getTodayKey()) {
  return Boolean(
    task.dueDate && !task.completed && isDateBefore(task.dueDate, todayKey),
  );
}

export function getTaskFilterCount(
  tasks: Task[],
  filter: TaskFilter,
  todayKey = getTodayKey(),
) {
  return filterTasks(tasks, filter, "", todayKey).length;
}

export function filterTasks(
  tasks: Task[],
  filter: TaskFilter,
  searchQuery: string,
  todayKey = getTodayKey(),
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);

    if (!matchesSearch) {
      return false;
    }

    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "overdue") {
      return isTaskOverdue(task, todayKey);
    }

    if (filter === "high") {
      return task.priority === "high";
    }

    return true;
  });
}

export function getTaskSummary(tasks: Task[], todayKey = getTodayKey()) {
  const completed = tasks.filter((task) => task.completed).length;
  const overdue = tasks.filter((task) => isTaskOverdue(task, todayKey)).length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;

  return {
    active: tasks.length - completed,
    completed,
    highPriority,
    overdue,
    total: tasks.length,
  };
}

export function getDueDateLabel(task: Task, todayKey = getTodayKey()) {
  if (!task.dueDate) {
    return "No due date";
  }

  if (task.dueDate === todayKey) {
    return "Due today";
  }

  if (isTaskOverdue(task, todayKey)) {
    return `Overdue since ${formatFriendlyDate(task.dueDate)}`;
  }

  return `Due ${formatFriendlyDate(task.dueDate)}`;
}
