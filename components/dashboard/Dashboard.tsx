"use client";

import { useMemo, useState } from "react";

import { HabitSection } from "@/components/habits/HabitSection";
import { TaskSection } from "@/components/tasks/TaskSection";
import { Icon } from "@/components/ui/Icon";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { calculateStreak, getTodayKey } from "@/lib/date";
import { createId } from "@/lib/id";
import type { DashboardStats, Habit, Task, TaskFilter } from "@/lib/types";
import { StatsGrid } from "./StatsGrid";
import { WelcomePanel } from "./WelcomePanel";

const TASK_STORAGE_KEY = "pulseboard:tasks";
const HABIT_STORAGE_KEY = "pulseboard:habits";
const INITIAL_TASKS: Task[] = [];
const INITIAL_HABITS: Habit[] = [];

export default function Dashboard() {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks, tasksReady] = useLocalStorageState<Task[]>(
    TASK_STORAGE_KEY,
    INITIAL_TASKS,
  );
  const [habits, setHabits, habitsReady] = useLocalStorageState<Habit[]>(
    HABIT_STORAGE_KEY,
    INITIAL_HABITS,
  );

  const todayKey = getTodayKey();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = tasks.length - completedTasks;
  const stats: DashboardStats = {
    activeHabits: habits.length,
    completedTasks,
    completionPercentage:
      tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100),
    totalTasks: tasks.length,
  };

  const bestStreak = useMemo(
    () =>
      habits.reduce(
        (best, habit) =>
          Math.max(best, calculateStreak(habit.completedDates, todayKey)),
        0,
      ),
    [habits, todayKey],
  );

  function addTask(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) => [
      {
        completed: false,
        createdAt: new Date().toISOString(),
        id: createId("task"),
        title: trimmedTitle,
      },
      ...currentTasks,
    ]);
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }

  function addHabit(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return false;
    }

    const habitExists = habits.some(
      (habit) => habit.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (habitExists) {
      return false;
    }

    setHabits((currentHabits) => [
      {
        completedDates: [],
        createdAt: new Date().toISOString(),
        id: createId("habit"),
        name: trimmedName,
      },
      ...currentHabits,
    ]);

    return true;
  }

  function toggleHabitToday(habitId: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const hasCompletedToday = habit.completedDates.includes(todayKey);

        return {
          ...habit,
          completedDates: hasCompletedToday
            ? habit.completedDates.filter((dateKey) => dateKey !== todayKey)
            : [...habit.completedDates, todayKey].sort(),
        };
      }),
    );
  }

  function deleteHabit(habitId: string) {
    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId),
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#eef4f2_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Icon name="target" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Task & Habit Tracker
              </p>
              <p className="text-xl font-semibold text-slate-950">
                PulseBoard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:self-auto">
            <Icon name="checkCircle" className="h-4 w-4" />
            {tasksReady && habitsReady ? "Saved locally" : "Syncing"}
          </div>
        </header>

        <WelcomePanel
          activeTasks={activeTasks}
          bestStreak={bestStreak}
          stats={stats}
        />

        <StatsGrid stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <TaskSection
            filter={taskFilter}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onFilterChange={setTaskFilter}
            onToggleTask={toggleTask}
            tasks={tasks}
          />
          <HabitSection
            habits={habits}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onToggleToday={toggleHabitToday}
            todayKey={todayKey}
          />
        </div>
      </div>
    </main>
  );
}
