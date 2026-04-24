export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  completedDates: string[];
  createdAt: string;
};

export type TaskFilter = "all" | "active" | "completed";

export type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  activeHabits: number;
  completionPercentage: number;
};
