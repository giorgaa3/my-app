export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  completedDates: string[];
  createdAt: string;
};

export type TaskPriority = "low" | "medium" | "high";

export type TaskFilter =
  | "all"
  | "active"
  | "completed"
  | "overdue"
  | "high";

export type ThemeMode = "light" | "dark";

export type ToastTone = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  message: string;
  tone: ToastTone;
};

export type TaskInput = {
  title: string;
  priority: TaskPriority;
  dueDate?: string;
};

export type HabitInput = {
  name: string;
  emoji: string;
  category: string;
};

export type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
  activeHabits: number;
  habitsDoneToday: number;
  completionPercentage: number;
};
