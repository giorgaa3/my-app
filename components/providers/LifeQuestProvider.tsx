"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { LevelUpModal } from "@/components/lifequest/LevelUpModal";
import { ToastViewport } from "@/components/ui/Toast";
import { useLanguage } from "@/hooks/use-language";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  buyAvatarItem as buyAvatarItemHelper,
  equipAvatarItem as equipAvatarItemHelper,
  initialUserAvatar,
  normalizeUserAvatar,
  unequipAvatarCategory as unequipAvatarCategoryHelper,
} from "@/lib/avatar";
import { getTodayKey } from "@/lib/date";
import { getHabitDashboardSummary, normalizeHabits } from "@/lib/habits";
import { getAchievementTitleKey, getLevelTitleKey } from "@/lib/i18n";
import { createId } from "@/lib/id";
import {
  addReward,
  FOCUS_REWARD,
  getAchievements,
  getHabitCheckInKey,
  getLevelInfo,
  HABIT_REWARD,
  initialLifeQuestProfile,
  normalizeLifeQuestProfile,
  syncLifeQuestProfile,
  TASK_REWARDS,
} from "@/lib/lifequest";
import { getTaskSummary, normalizeTasks } from "@/lib/tasks";
import type {
  DashboardStats,
  AvatarItem,
  AvatarItemCategory,
  Habit,
  HabitInput,
  LevelUpDetails,
  LifeQuestProfile,
  Task,
  TaskFilter,
  TaskInput,
  ThemeMode,
  UserAvatar,
} from "@/lib/types";

const TASK_STORAGE_KEY = "pulseboard:tasks";
const HABIT_STORAGE_KEY = "pulseboard:habits";
const LIFEQUEST_PROFILE_STORAGE_KEY = "lifequest:profile";
const AVATAR_STORAGE_KEY = "lifequest:avatar";
const INITIAL_TASKS: Task[] = [];
const INITIAL_HABITS: Habit[] = [];

type LifeQuestContextValue = {
  addHabit: (habit: HabitInput) => void;
  addTask: (task: TaskInput) => void;
  avatar: UserAvatar;
  buyAvatarItem: (item: AvatarItem) => void;
  completeFocusSession: () => void;
  deleteHabit: (habitId: string) => void;
  deleteTask: (taskId: string) => void;
  equipAvatarItem: (item: AvatarItem) => void;
  habitSummary: ReturnType<typeof getHabitDashboardSummary>;
  habits: Habit[];
  isStorageReady: boolean;
  profile: LifeQuestProfile;
  resetHabit: (habitId: string) => void;
  setTaskFilter: Dispatch<SetStateAction<TaskFilter>>;
  stats: DashboardStats;
  taskFilter: TaskFilter;
  taskSummary: ReturnType<typeof getTaskSummary>;
  tasks: Task[];
  theme: ThemeMode;
  todayKey: string;
  toggleHabitToday: (habitId: string) => void;
  toggleTask: (taskId: string) => void;
  toggleTheme: () => void;
  unequipAvatarCategory: (category: AvatarItemCategory) => void;
  updateTask: (taskId: string, task: TaskInput) => void;
};

const LifeQuestContext = createContext<LifeQuestContextValue | null>(null);

type LifeQuestProviderProps = {
  children: ReactNode;
};

export function LifeQuestProvider({ children }: LifeQuestProviderProps) {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [levelUpDetails, setLevelUpDetails] =
    useState<LevelUpDetails | null>(null);
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
  const [storedAvatar, setAvatar] = useLocalStorageState<UserAvatar>(
    AVATAR_STORAGE_KEY,
    initialUserAvatar,
  );
  const { theme, toggleTheme } = useTheme();
  const { dismissToast, showToast, toasts } = useToast();
  const { t } = useLanguage();

  const todayKey = getTodayKey();
  const tasks = useMemo(() => normalizeTasks(storedTasks), [storedTasks]);
  const habits = useMemo(() => normalizeHabits(storedHabits), [storedHabits]);
  const profile = useMemo(
    () => normalizeLifeQuestProfile(storedProfile),
    [storedProfile],
  );
  const avatar = useMemo(
    () => normalizeUserAvatar(storedAvatar),
    [storedAvatar],
  );
  const taskSummary = useMemo(
    () => getTaskSummary(tasks, todayKey),
    [tasks, todayKey],
  );
  const habitSummary = useMemo(
    () => getHabitDashboardSummary(habits, todayKey),
    [habits, todayKey],
  );

  const stats: DashboardStats = useMemo(
    () => ({
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
    }),
    [habitSummary.completedToday, habits.length, taskSummary, tasks.length],
  );

  const persistProfile = useCallback(
    (
      nextProfile: LifeQuestProfile,
      nextTasks = tasks,
      nextHabits = habits,
    ) => {
      const previousLevel = getLevelInfo(profile.xp);
      const previousAchievements = new Set(profile.unlockedAchievementIds);
      const syncedProfile = syncLifeQuestProfile(
        nextProfile,
        nextTasks,
        nextHabits,
        todayKey,
      );
      const nextLevel = getLevelInfo(syncedProfile.xp);

      setProfile(syncedProfile);

      if (nextLevel.level > previousLevel.level) {
        const newlyUnlockedAchievements = getAchievements(
          syncedProfile,
          todayKey,
        )
          .filter(
            (achievement) =>
              achievement.unlocked && !previousAchievements.has(achievement.id),
          )
          .map((achievement) => t(getAchievementTitleKey(achievement.id)));

        setLevelUpDetails({
          achievements: newlyUnlockedAchievements,
          avatar: nextLevel.avatar,
          coinsGained: Math.max(syncedProfile.coins - profile.coins, 0),
          level: nextLevel.level,
          title: t(getLevelTitleKey(nextLevel.title)),
          totalCoins: syncedProfile.coins,
          xp: syncedProfile.xp,
          xpGained: Math.max(syncedProfile.xp - profile.xp, 0),
        });
      }
    },
    [habits, profile, setProfile, t, tasks, todayKey],
  );

  const addTask = useCallback(
    (taskInput: TaskInput) => {
      if (!taskInput.title.trim()) {
        showToast(t("toast.addTaskTitle"), "error");
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

      showToast(t("toast.taskAdded"), "success");
    },
    [setTasks, showToast, t, tasks],
  );

  const updateTask = useCallback(
    (taskId: string, taskInput: TaskInput) => {
      if (!taskInput.title.trim()) {
        showToast(t("toast.taskTitleEmpty"), "error");
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

      showToast(t("toast.taskUpdated"), "success");
    },
    [setTasks, showToast, t, tasks],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
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
      persistProfile(nextProfile, nextTasks, habits);

      showToast(
        isCompleting
          ? t("toast.taskReward", { xp: TASK_REWARDS[task.priority].xp })
          : t("toast.taskActive"),
        isCompleting ? "success" : "info",
      );
    },
    [habits, persistProfile, profile, setTasks, showToast, t, tasks, todayKey],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((currentTask) => currentTask.id === taskId);

      if (!task || !window.confirm(t("confirm.deleteTask", { title: task.title }))) {
        return;
      }

      setTasks(tasks.filter((currentTask) => currentTask.id !== taskId));
      showToast(t("toast.taskDeleted"), "info");
    },
    [setTasks, showToast, t, tasks],
  );

  const addHabit = useCallback(
    (habitInput: HabitInput) => {
      const trimmedName = habitInput.name.trim();

      if (!trimmedName) {
        showToast(t("toast.addHabitName"), "error");
        return;
      }

      const habitExists = habits.some(
        (habit) => habit.name.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (habitExists) {
        showToast(t("toast.duplicateHabit"), "error");
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

      showToast(t("toast.habitAdded"), "success");
    },
    [habits, setHabits, showToast, t],
  );

  const toggleHabitToday = useCallback(
    (habitId: string) => {
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
            ? currentHabit.completedDates.filter(
                (dateKey) => dateKey !== todayKey,
              )
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
      persistProfile(nextProfile, tasks, nextHabits);

      showToast(
        hasCompletedToday
          ? t("toast.habitRemovedToday")
          : t("toast.habitReward", { xp: HABIT_REWARD.xp }),
        hasCompletedToday ? "info" : "success",
      );
    },
    [habits, persistProfile, profile, setHabits, showToast, t, tasks, todayKey],
  );

  const resetHabit = useCallback(
    (habitId: string) => {
      const habit = habits.find((currentHabit) => currentHabit.id === habitId);

      if (
        !habit ||
        !window.confirm(t("confirm.resetHabit", { name: habit.name }))
      ) {
        return;
      }

      setHabits(
        habits.map((currentHabit) =>
          currentHabit.id === habitId
            ? { ...currentHabit, completedDates: [] }
            : currentHabit,
        ),
      );

      showToast(t("toast.habitProgressReset"), "info");
    },
    [habits, setHabits, showToast, t],
  );

  const deleteHabit = useCallback(
    (habitId: string) => {
      const habit = habits.find((currentHabit) => currentHabit.id === habitId);

      if (!habit || !window.confirm(t("confirm.deleteHabit", { name: habit.name }))) {
        return;
      }

      setHabits(habits.filter((currentHabit) => currentHabit.id !== habitId));
      showToast(t("toast.habitDeleted"), "info");
    },
    [habits, setHabits, showToast, t],
  );

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

    persistProfile(nextProfile, tasks, habits);
    showToast(t("toast.focusComplete", { xp: FOCUS_REWARD.xp }), "success");
  }, [habits, persistProfile, profile, showToast, t, tasks, todayKey]);

  const buyAvatarItem = useCallback(
    (item: AvatarItem) => {
      const levelInfo = getLevelInfo(profile.xp);
      const purchase = buyAvatarItemHelper(
        profile.coins,
        levelInfo.level,
        item,
        avatar,
      );

      if (!purchase.ok) {
        if (purchase.reason === "locked") {
          showToast(
            t("toast.avatarLocked", {
              level: item.requiredLevel ?? 1,
            }),
            "error",
          );
          return;
        }

        if (purchase.reason === "not-enough-coins") {
          showToast(
            t("toast.avatarNotEnoughCoins", {
              coins: profile.coins,
              price: item.price,
            }),
            "error",
          );
          return;
        }

        showToast(t("toast.avatarAlreadyOwned"), "info");
        return;
      }

      setProfile({
        ...profile,
        coins: purchase.coins,
      });
      setAvatar(purchase.avatar);
      showToast(t("toast.avatarPurchased"), "success");
    },
    [avatar, profile, setAvatar, setProfile, showToast, t],
  );

  const equipAvatarItem = useCallback(
    (item: AvatarItem) => {
      if (!avatar.ownedItemIds.includes(item.id)) {
        showToast(t("toast.avatarEquipLocked"), "error");
        return;
      }

      setAvatar(equipAvatarItemHelper(avatar, item));
      showToast(t("toast.avatarEquipped"), "success");
    },
    [avatar, setAvatar, showToast, t],
  );

  const unequipAvatarCategory = useCallback(
    (category: AvatarItemCategory) => {
      if (!avatar.equipped[category]) {
        return;
      }

      setAvatar(unequipAvatarCategoryHelper(avatar, category));
      showToast(t("toast.avatarUnequipped"), "info");
    },
    [avatar, setAvatar, showToast, t],
  );

  const contextValue = useMemo<LifeQuestContextValue>(
    () => ({
      addHabit,
      addTask,
      avatar,
      buyAvatarItem,
      completeFocusSession,
      deleteHabit,
      deleteTask,
      equipAvatarItem,
      habitSummary,
      habits,
      isStorageReady: tasksReady && habitsReady,
      profile,
      resetHabit,
      setTaskFilter,
      stats,
      taskFilter,
      taskSummary,
      tasks,
      theme,
      todayKey,
      toggleHabitToday,
      toggleTask,
      toggleTheme,
      unequipAvatarCategory,
      updateTask,
    }),
    [
      addHabit,
      addTask,
      avatar,
      buyAvatarItem,
      completeFocusSession,
      deleteHabit,
      deleteTask,
      equipAvatarItem,
      habitSummary,
      habits,
      habitsReady,
      profile,
      resetHabit,
      stats,
      taskFilter,
      taskSummary,
      tasks,
      tasksReady,
      theme,
      todayKey,
      toggleHabitToday,
      toggleTask,
      toggleTheme,
      unequipAvatarCategory,
      updateTask,
    ],
  );

  return (
    <LifeQuestContext.Provider value={contextValue}>
      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
      <LevelUpModal
        details={levelUpDetails}
        onClose={() => setLevelUpDetails(null)}
      />
      {children}
    </LifeQuestContext.Provider>
  );
}

export function useLifeQuest() {
  const context = useContext(LifeQuestContext);

  if (!context) {
    throw new Error("useLifeQuest must be used inside LifeQuestProvider.");
  }

  return context;
}
