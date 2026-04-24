"use client";

import { useMemo, useState } from "react";

import { HabitSection } from "@/components/habits/HabitSection";
import { TaskSection } from "@/components/tasks/TaskSection";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ToastViewport } from "@/components/ui/Toast";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { getTodayKey } from "@/lib/date";
import { getHabitDashboardSummary, normalizeHabits } from "@/lib/habits";
import { createId } from "@/lib/id";
import { getTaskSummary, normalizeTasks } from "@/lib/tasks";
import type {
  DashboardStats,
  Habit,
  HabitInput,
  Task,
  TaskFilter,
  TaskInput,
} from "@/lib/types";
import { StatsGrid } from "./StatsGrid";
import { WelcomePanel } from "./WelcomePanel";

const TASK_STORAGE_KEY = "pulseboard:tasks";
const HABIT_STORAGE_KEY = "pulseboard:habits";
const INITIAL_TASKS: Task[] = [];
const INITIAL_HABITS: Habit[] = [];

export default function Dashboard() {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [storedTasks, setTasks, tasksReady] = useLocalStorageState<Task[]>(
    TASK_STORAGE_KEY,
    INITIAL_TASKS,
  );
  const [storedHabits, setHabits, habitsReady] = useLocalStorageState<Habit[]>(
    HABIT_STORAGE_KEY,
    INITIAL_HABITS,
  );
  const { theme, toggleTheme } = useTheme();
  const { dismissToast, showToast, toasts } = useToast();

  const todayKey = getTodayKey();
  const tasks = useMemo(() => normalizeTasks(storedTasks), [storedTasks]);
  const habits = useMemo(() => normalizeHabits(storedHabits), [storedHabits]);
  const taskSummary = useMemo(
    () => getTaskSummary(tasks, todayKey),
    [tasks, todayKey],
  );
  const habitSummary = useMemo(
    () => getHabitDashboardSummary(habits, todayKey),
    [habits, todayKey],
  );
  const stats: DashboardStats = {
    activeHabits: habits.length,
    completedTasks: taskSummary.completed,
    completionPercentage:
      tasks.length === 0
        ? 0
        : Math.round((taskSummary.completed / tasks.length) * 100),
    habitsDoneToday: habitSummary.completedToday,
    highPriorityTasks: taskSummary.highPriority,
    overdueTasks: taskSummary.overdue,
    totalTasks: tasks.length,
  };

  function addTask(taskInput: TaskInput) {
    if (!taskInput.title.trim()) {
      showToast("Add a task title first.", "error");
      return;
    }

    setTasks((currentTasks) => [
      {
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: taskInput.dueDate,
        id: createId("task"),
        priority: taskInput.priority,
        title: taskInput.title.trim(),
      },
      ...normalizeTasks(currentTasks),
    ]);

    showToast("Task added to your plan.", "success");
  }

  function updateTask(taskId: string, taskInput: TaskInput) {
    if (!taskInput.title.trim()) {
      showToast("Task title cannot be empty.", "error");
      return;
    }

    setTasks((currentTasks) =>
      normalizeTasks(currentTasks).map((task) =>
        task.id === taskId
          ? {
              ...task,
              dueDate: taskInput.dueDate,
              priority: taskInput.priority,
              title: taskInput.title.trim(),
            }
          : task,
      ),
    );

    showToast("Task updated.", "success");
  }

  function toggleTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    setTasks((currentTasks) =>
      normalizeTasks(currentTasks).map((currentTask) =>
        currentTask.id === taskId
          ? { ...currentTask, completed: !currentTask.completed }
          : currentTask,
      ),
    );

    if (task) {
      showToast(
        task.completed ? "Task moved back to active." : "Task completed.",
        "success",
      );
    }
  }

  function deleteTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task || !window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setTasks((currentTasks) =>
      normalizeTasks(currentTasks).filter(
        (currentTask) => currentTask.id !== taskId,
      ),
    );

    showToast("Task deleted.", "info");
  }

  function addHabit(habitInput: HabitInput) {
    const trimmedName = habitInput.name.trim();

    if (!trimmedName) {
      showToast("Add a habit name first.", "error");
      return;
    }

    const habitExists = habits.some(
      (habit) => habit.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (habitExists) {
      showToast("That habit already exists.", "error");
      return;
    }

    setHabits((currentHabits) => [
      {
        category: habitInput.category,
        completedDates: [],
        createdAt: new Date().toISOString(),
        emoji: habitInput.emoji.trim() || "🌿",
        id: createId("habit"),
        name: trimmedName,
      },
      ...normalizeHabits(currentHabits),
    ]);

    showToast("Habit added.", "success");
  }

  function toggleHabitToday(habitId: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === habitId);

    setHabits((currentHabits) =>
      normalizeHabits(currentHabits).map((currentHabit) => {
        if (currentHabit.id !== habitId) {
          return currentHabit;
        }

        const hasCompletedToday = currentHabit.completedDates.includes(todayKey);

        return {
          ...currentHabit,
          completedDates: hasCompletedToday
            ? currentHabit.completedDates.filter(
                (dateKey) => dateKey !== todayKey,
              )
            : [...currentHabit.completedDates, todayKey].sort(),
        };
      }),
    );

    if (habit) {
      showToast(
        habit.completedDates.includes(todayKey)
          ? "Today's habit check-in was removed."
          : "Habit checked off for today.",
        "success",
      );
    }
  }

  function resetHabit(habitId: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === habitId);

    if (!habit || !window.confirm(`Reset all progress for "${habit.name}"?`)) {
      return;
    }

    setHabits((currentHabits) =>
      normalizeHabits(currentHabits).map((currentHabit) =>
        currentHabit.id === habitId
          ? { ...currentHabit, completedDates: [] }
          : currentHabit,
      ),
    );

    showToast("Habit progress reset.", "info");
  }

  function deleteHabit(habitId: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === habitId);

    if (!habit || !window.confirm(`Delete "${habit.name}"?`)) {
      return;
    }

    setHabits((currentHabits) =>
      normalizeHabits(currentHabits).filter(
        (currentHabit) => currentHabit.id !== habitId,
      ),
    );

    showToast("Habit deleted.", "info");
  }

  return (
    <main className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="dashboard-card flex flex-col gap-4 rounded-lg px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--accent-blue),var(--accent-purple),var(--brand))] text-white shadow-lg shadow-blue-500/20">
              <Icon name="target" className="h-5 w-5" />
            </div>
            <div>
              <p className="section-muted text-sm font-medium">
                Task & Habit Tracker
              </p>
              <p className="section-title text-xl font-semibold">PulseBoard</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              <Icon name="checkCircle" className="h-4 w-4" />
              {tasksReady && habitsReady ? "Autosaved locally" : "Syncing"}
            </div>
            <ThemeToggle onToggle={toggleTheme} theme={theme} />
          </div>
        </header>

        <WelcomePanel
          activeTasks={taskSummary.active}
          bestStreak={habitSummary.bestStreak}
          completedHabitsToday={habitSummary.completedToday}
          stats={stats}
          totalHabits={habitSummary.total}
        />

        <StatsGrid stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
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
          <HabitSection
            habits={habits}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onResetHabit={resetHabit}
            onToggleToday={toggleHabitToday}
            todayKey={todayKey}
          />
        </div>
      </div>
    </main>
  );
}
