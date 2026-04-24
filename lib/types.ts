export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  category: LifeArea;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  category: LifeArea;
  completedDates: string[];
  createdAt: string;
};

export type LifeArea =
  | "Work"
  | "Learning"
  | "Health"
  | "Money"
  | "Personal"
  | "Creative";

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
  category: LifeArea;
  dueDate?: string;
};

export type HabitInput = {
  name: string;
  emoji: string;
  category: LifeArea;
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

export type RewardBundle = {
  coins: number;
  xp: number;
};

export type LifeQuestProfile = {
  xp: number;
  coins: number;
  completedFocusSessions: number;
  rewardedTaskIds: string[];
  rewardedHabitCheckIns: string[];
  claimedDailyQuestIds: string[];
  unlockedAchievementIds: string[];
  activeDates: string[];
  focusSessionDates: string[];
  totalTaskCompletions: number;
  totalHabitCompletions: number;
};

export type LevelInfo = {
  avatar: string;
  currentLevelXp: number;
  level: number;
  nextLevelXp: number;
  progress: number;
  title: string;
  xpIntoLevel: number;
  xpToNextLevel: number;
};

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: RewardBundle;
  completed: boolean;
  claimed: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type RewardItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  cost: number;
  unlocked: boolean;
};

export type LifeAreaProgress = {
  area: LifeArea;
  completed: number;
  emoji: string;
  progress: number;
  total: number;
};
