"use client";

import { useCallback, useMemo, useState } from "react";

import { HabitSection } from "@/components/habits/HabitSection";
import { AchievementsPanel } from "@/components/lifequest/AchievementsPanel";
import { CharacterCard } from "@/components/lifequest/CharacterCard";
import { DailyQuestBoard } from "@/components/lifequest/DailyQuestBoard";
import { FocusArena } from "@/components/lifequest/FocusArena";
import { LifeAreasGrid } from "@/components/lifequest/LifeAreasGrid";
import { RewardShop } from "@/components/lifequest/RewardShop";
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
import {
  addReward,
  FOCUS_REWARD,
  getHabitCheckInKey,
  HABIT_REWARD,
  initialLifeQuestProfile,
  normalizeLifeQuestProfile,
  syncLifeQuestProfile,
  TASK_REWARDS,
} from "@/lib/lifequest";
import { getTaskSummary, normalizeTasks } from "@/lib/tasks";
import type {
  DashboardStats,
  Habit,
  HabitInput,
  LifeQuestProfile,
  Task,
  TaskFilter,
  TaskInput,
} from "@/lib/types";
import { StatsGrid } from "./StatsGrid";
import { WelcomePanel } from "./WelcomePanel";

const TASK_STORAGE_KEY = "pulseboard:tasks";
const HABIT_STORAGE_KEY = "pulseboard:habits";
const LIFEQUEST_PROFILE_STORAGE_KEY = "lifequest:profile";
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
  const [storedProfile, setProfile] =
    useLocalStorageState<LifeQuestProfile>(
      LIFEQUEST_PROFILE_STORAGE_KEY,
      initialLifeQuestProfile,
    );
  const { theme, toggleTheme } = useTheme();
  const { dismissToast, showToast, toasts } = useToast();

  const todayKey = getTodayKey();
  const tasks = useMemo(() => normalizeTasks(storedTasks), [storedTasks]);
  const habits = useMemo(() => normalizeHabits(storedHabits), [storedHabits]);
  const profile = useMemo(
    () => normalizeLifeQuestProfile(storedProfile),
    [storedProfile],
  );
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

  const saveProfile = useCallback(
    (nextProfile: LifeQuestProfile, nextTasks = tasks, nextHabits = habits) => {
      setProfile(
        syncLifeQuestProfile(nextProfile, nextTasks, nextHabits, todayKey),
      );
    },
    [habits, setProfile, tasks, todayKey],
  );

  function addTask(taskInput: TaskInput) {
    if (!taskInput.title.trim()) {
      showToast("Add a task title first.", "error");
      return;
    }

    setTasks([
      {
        category: taskInput.category,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: taskInput.dueDate,
        id: createId("task"),
        priority: taskInput.priority,
        title: taskInput.title.trim(),
      },
      ...tasks,
    ]);

    showToast("Quest added to your log.", "success");
  }

  function updateTask(taskId: string, taskInput: TaskInput) {
    if (!taskInput.title.trim()) {
      showToast("Task title cannot be empty.", "error");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              category: taskInput.category,
              dueDate: taskInput.dueDate,
              priority: taskInput.priority,
              title: taskInput.title.trim(),
            }
          : task,
      ),
    );

    showToast("Quest updated.", "success");
  }

  function toggleTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    const isCompleting = !task.completed;
    const completedAt = isCompleting ? new Date().toISOString() : undefined;
    const nextTasks = tasks.map((currentTask) =>
      currentTask.id === taskId
        ? { ...currentTask, completed: isCompleting, completedAt }
        : currentTask,
    );
    let nextProfile = profile;

    if (isCompleting && !profile.rewardedTaskIds.includes(task.id)) {
      nextProfile = addReward(
        {
          ...profile,
          rewardedTaskIds: [...profile.rewardedTaskIds, task.id],
          totalTaskCompletions: profile.totalTaskCompletions + 1,
        },
        TASK_REWARDS[task.priority],
        todayKey,
      );
    }

    setTasks(nextTasks);
    saveProfile(nextProfile, nextTasks, habits);

    showToast(
      isCompleting
        ? `Quest complete: +${TASK_REWARDS[task.priority].xp} XP`
        : "Task moved back to active.",
      isCompleting ? "success" : "info",
    );
  }

  function deleteTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task || !window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setTasks(tasks.filter((currentTask) => currentTask.id !== taskId));
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

    setHabits([
      {
        category: habitInput.category,
        completedDates: [],
        createdAt: new Date().toISOString(),
        emoji: habitInput.emoji.trim() || "🌱",
        id: createId("habit"),
        name: trimmedName,
      },
      ...habits,
    ]);

    showToast("Habit added to your training plan.", "success");
  }

  function toggleHabitToday(habitId: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === habitId);

    if (!habit) {
      return;
    }

    const checkInKey = getHabitCheckInKey(habitId, todayKey);
    const hasCompletedToday = habit.completedDates.includes(todayKey);
    const nextHabits = habits.map((currentHabit) => {
      if (currentHabit.id !== habitId) {
        return currentHabit;
      }

      return {
        ...currentHabit,
        completedDates: hasCompletedToday
          ? currentHabit.completedDates.filter((dateKey) => dateKey !== todayKey)
          : [...currentHabit.completedDates, todayKey].sort(),
      };
    });
    let nextProfile = profile;

    if (
      !hasCompletedToday &&
      !profile.rewardedHabitCheckIns.includes(checkInKey)
    ) {
      nextProfile = addReward(
        {
          ...profile,
          rewardedHabitCheckIns: [
            ...profile.rewardedHabitCheckIns,
            checkInKey,
          ],
          totalHabitCompletions: profile.totalHabitCompletions + 1,
        },
        HABIT_REWARD,
        todayKey,
      );
    }

    setHabits(nextHabits);
    saveProfile(nextProfile, tasks, nextHabits);

    showToast(
      hasCompletedToday
        ? "Today's habit check-in was removed."
        : `Habit complete: +${HABIT_REWARD.xp} XP`,
      hasCompletedToday ? "info" : "success",
    );
  }

  function resetHabit(habitId: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === habitId);

    if (!habit || !window.confirm(`Reset all progress for "${habit.name}"?`)) {
      return;
    }

    setHabits(
      habits.map((currentHabit) =>
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

    setHabits(habits.filter((currentHabit) => currentHabit.id !== habitId));
    showToast("Habit deleted.", "info");
  }

  const completeFocusSession = useCallback(() => {
    const nextProfile = addReward(
      {
        ...profile,
        completedFocusSessions: profile.completedFocusSessions + 1,
        focusSessionDates: [...profile.focusSessionDates, todayKey],
      },
      FOCUS_REWARD,
      todayKey,
    );

    saveProfile(nextProfile, tasks, habits);
    showToast(`Focus session complete: +${FOCUS_REWARD.xp} XP`, "success");
  }, [habits, profile, saveProfile, showToast, tasks, todayKey]);

  return (
    <main className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="dashboard-card flex flex-col gap-4 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="brand-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl">
              ⚔️
            </div>
            <div>
              <p className="section-muted text-sm font-medium">
                Productivity RPG Dashboard
              </p>
              <p className="section-title text-xl font-semibold">LifeQuest</p>
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

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <CharacterCard profile={profile} todayKey={todayKey} />
          <DailyQuestBoard
            habits={habits}
            profile={profile}
            tasks={tasks}
            todayKey={todayKey}
          />
        </div>

        <WelcomePanel
          activeTasks={taskSummary.active}
          bestStreak={habitSummary.bestStreak}
          completedHabitsToday={habitSummary.completedToday}
          stats={stats}
          totalHabits={habitSummary.total}
        />

        <StatsGrid stats={stats} />

        <LifeAreasGrid habits={habits} tasks={tasks} todayKey={todayKey} />

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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <FocusArena onCompleteSession={completeFocusSession} tasks={tasks} />
          <RewardShop profile={profile} />
        </div>

        <AchievementsPanel profile={profile} todayKey={todayKey} />
      </div>
    </main>
  );
}
