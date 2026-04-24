import {
  calculateStreak,
  dedupeDateKeys,
  getTodayKey,
} from "@/lib/date";
import { lifeAreaOptions } from "@/lib/lifeAreas";
import type {
  Achievement,
  DailyQuest,
  Habit,
  LevelInfo,
  LifeAreaProgress,
  LifeQuestProfile,
  RewardBundle,
  RewardItem,
  Task,
} from "@/lib/types";

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000];
const LEVEL_TITLES = [
  "Starter",
  "Builder",
  "Focus Apprentice",
  "Discipline Hunter",
  "Productivity Master",
];

export const TASK_REWARDS: Record<Task["priority"], RewardBundle> = {
  high: { coins: 14, xp: 28 },
  low: { coins: 6, xp: 12 },
  medium: { coins: 9, xp: 18 },
};

export const HABIT_REWARD: RewardBundle = { coins: 8, xp: 16 };
export const FOCUS_REWARD: RewardBundle = { coins: 20, xp: 40 };

export const initialLifeQuestProfile: LifeQuestProfile = {
  activeDates: [],
  claimedDailyQuestIds: [],
  coins: 0,
  completedFocusSessions: 0,
  focusSessionDates: [],
  rewardedHabitCheckIns: [],
  rewardedTaskIds: [],
  totalHabitCompletions: 0,
  totalTaskCompletions: 0,
  unlockedAchievementIds: [],
  xp: 0,
};

export function normalizeLifeQuestProfile(value: unknown): LifeQuestProfile {
  if (!value || typeof value !== "object") {
    return initialLifeQuestProfile;
  }

  const storedProfile = value as Partial<LifeQuestProfile>;

  return {
    activeDates: dedupeDateKeys(storedProfile.activeDates ?? []),
    claimedDailyQuestIds: storedProfile.claimedDailyQuestIds ?? [],
    coins: storedProfile.coins ?? 0,
    completedFocusSessions: storedProfile.completedFocusSessions ?? 0,
    focusSessionDates: storedProfile.focusSessionDates ?? [],
    rewardedHabitCheckIns: storedProfile.rewardedHabitCheckIns ?? [],
    rewardedTaskIds: storedProfile.rewardedTaskIds ?? [],
    totalHabitCompletions: storedProfile.totalHabitCompletions ?? 0,
    totalTaskCompletions: storedProfile.totalTaskCompletions ?? 0,
    unlockedAchievementIds: storedProfile.unlockedAchievementIds ?? [],
    xp: storedProfile.xp ?? 0,
  };
}

export function getLevelInfo(xp: number): LevelInfo {
  const levelIndex = LEVEL_THRESHOLDS.findLastIndex((threshold) => xp >= threshold);
  const safeLevelIndex = Math.max(levelIndex, 0);
  const level = safeLevelIndex + 1;
  const currentLevelXp = LEVEL_THRESHOLDS[safeLevelIndex] ?? 0;
  const nextLevelXp =
    LEVEL_THRESHOLDS[safeLevelIndex + 1] ?? currentLevelXp + 400;
  const xpIntoLevel = xp - currentLevelXp;
  const xpToNextLevel = Math.max(nextLevelXp - xp, 0);
  const progress = Math.min(
    100,
    Math.round((xpIntoLevel / Math.max(nextLevelXp - currentLevelXp, 1)) * 100),
  );

  return {
    avatar: getAvatarForLevel(level),
    currentLevelXp,
    level,
    nextLevelXp,
    progress,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xpIntoLevel,
    xpToNextLevel,
  };
}

export function getAvatarForLevel(level: number) {
  if (level >= 5) {
    return "👑";
  }

  if (level === 4) {
    return "🚀";
  }

  if (level === 3) {
    return "🧠";
  }

  if (level === 2) {
    return "🧑‍💻";
  }

  return "🌱";
}

export function getDailyStreak(activeDates: string[], todayKey = getTodayKey()) {
  return calculateStreak(activeDates, todayKey);
}

export function addReward(
  profile: LifeQuestProfile,
  reward: RewardBundle,
  todayKey = getTodayKey(),
) {
  return {
    ...profile,
    activeDates: dedupeDateKeys([...profile.activeDates, todayKey]),
    coins: profile.coins + reward.coins,
    xp: profile.xp + reward.xp,
  };
}

export function getHabitCheckInKey(habitId: string, todayKey = getTodayKey()) {
  return `${todayKey}:${habitId}`;
}

export function getFocusSessionsToday(profile: LifeQuestProfile, todayKey = getTodayKey()) {
  return profile.focusSessionDates.filter((dateKey) => dateKey === todayKey)
    .length;
}

export function getDailyQuests(
  profile: LifeQuestProfile,
  tasks: Task[],
  habits: Habit[],
  todayKey = getTodayKey(),
): DailyQuest[] {
  const tasksCompletedToday = tasks.filter(
    (task) => task.completedAt?.slice(0, 10) === todayKey,
  ).length;
  const habitsCompletedToday = habits.filter((habit) =>
    habit.completedDates.includes(todayKey),
  ).length;
  const highPriorityCompletedToday = tasks.filter(
    (task) =>
      task.priority === "high" &&
      task.completedAt?.slice(0, 10) === todayKey,
  ).length;
  const focusSessionsToday = getFocusSessionsToday(profile, todayKey);

  const quests: Array<Omit<DailyQuest, "claimed" | "completed">> = [
    {
      description: "Clear three tasks from today's board.",
      id: "complete-3-tasks",
      progress: tasksCompletedToday,
      reward: { coins: 25, xp: 50 },
      target: 3,
      title: "Complete 3 tasks today",
    },
    {
      description: "Check off two routines that support your real life.",
      id: "complete-2-habits",
      progress: habitsCompletedToday,
      reward: { coins: 20, xp: 40 },
      target: 2,
      title: "Complete 2 habits today",
    },
    {
      description: "Finish one high-priority task before the day gets noisy.",
      id: "finish-high-priority",
      progress: highPriorityCompletedToday,
      reward: { coins: 18, xp: 35 },
      target: 1,
      title: "Finish 1 high priority task",
    },
    {
      description: "Enter the Focus Arena and finish one full session.",
      id: "complete-focus-session",
      progress: focusSessionsToday,
      reward: { coins: 22, xp: 45 },
      target: 1,
      title: "Complete 1 focus session",
    },
  ];

  return quests.map((quest) => {
    const claimed = profile.claimedDailyQuestIds.includes(
      getDailyQuestClaimId(quest.id, todayKey),
    );

    return {
      ...quest,
      claimed,
      completed: quest.progress >= quest.target,
    };
  });
}

export function getDailyQuestClaimId(questId: string, todayKey = getTodayKey()) {
  return `${todayKey}:${questId}`;
}

export function syncDailyQuestRewards(
  profile: LifeQuestProfile,
  tasks: Task[],
  habits: Habit[],
  todayKey = getTodayKey(),
) {
  return getDailyQuests(profile, tasks, habits, todayKey).reduce(
    (currentProfile, quest) => {
      const claimId = getDailyQuestClaimId(quest.id, todayKey);

      if (!quest.completed || currentProfile.claimedDailyQuestIds.includes(claimId)) {
        return currentProfile;
      }

      return {
        ...addReward(currentProfile, quest.reward, todayKey),
        claimedDailyQuestIds: [...currentProfile.claimedDailyQuestIds, claimId],
      };
    },
    profile,
  );
}

export function getAchievements(
  profile: LifeQuestProfile,
  todayKey = getTodayKey(),
): Achievement[] {
  const levelInfo = getLevelInfo(profile.xp);
  const achievementDefinitions: Array<
    Omit<Achievement, "unlocked"> & { condition: boolean }
  > = [
    {
      condition: profile.totalTaskCompletions >= 1,
      description: "Complete your first task.",
      icon: "✅",
      id: "first-task",
      title: "First Task Completed",
    },
    {
      condition: profile.totalTaskCompletions >= 10,
      description: "Complete ten tasks across your quest log.",
      icon: "🏁",
      id: "ten-tasks",
      title: "10 Tasks Completed",
    },
    {
      condition: getDailyStreak(profile.activeDates, todayKey) >= 3,
      description: "Earn XP on three days in a row.",
      icon: "🔥",
      id: "three-day-streak",
      title: "3-Day Streak",
    },
    {
      condition: profile.completedFocusSessions >= 1,
      description: "Finish your first Focus Arena session.",
      icon: "⚔️",
      id: "first-focus",
      title: "First Focus Session",
    },
    {
      condition: levelInfo.level >= 5,
      description: "Reach level 5 and claim the crown.",
      icon: "👑",
      id: "level-five",
      title: "Level 5 Reached",
    },
  ];

  return achievementDefinitions.map(({ condition, ...achievement }) => ({
    ...achievement,
    unlocked:
      condition || profile.unlockedAchievementIds.includes(achievement.id),
  }));
}

export function syncAchievements(
  profile: LifeQuestProfile,
  todayKey = getTodayKey(),
) {
  const unlockedAchievementIds = getAchievements(profile, todayKey)
    .filter((achievement) => achievement.unlocked)
    .map((achievement) => achievement.id);

  return {
    ...profile,
    unlockedAchievementIds: Array.from(
      new Set([...profile.unlockedAchievementIds, ...unlockedAchievementIds]),
    ),
  };
}

export function syncLifeQuestProfile(
  profile: LifeQuestProfile,
  tasks: Task[],
  habits: Habit[],
  todayKey = getTodayKey(),
) {
  return syncAchievements(
    syncDailyQuestRewards(profile, tasks, habits, todayKey),
    todayKey,
  );
}

export function getRewardItems(profile: LifeQuestProfile): RewardItem[] {
  const levelInfo = getLevelInfo(profile.xp);
  const rewards: Array<Omit<RewardItem, "unlocked"> & { requiredLevel?: number }> =
    [
      {
        cost: 75,
        description: "A calm green profile frame for early momentum.",
        icon: "🌿",
        id: "verdant-frame",
        title: "Verdant Frame",
      },
      {
        cost: 150,
        description: "A blue focus aura for deep work days.",
        icon: "🔷",
        id: "focus-aura",
        title: "Focus Aura",
      },
      {
        cost: 240,
        description: "A premium purple dashboard glow.",
        icon: "💎",
        id: "arcane-glow",
        requiredLevel: 4,
        title: "Arcane Glow",
      },
    ];

  return rewards.map((reward) => ({
    ...reward,
    unlocked:
      profile.coins >= reward.cost &&
      (!reward.requiredLevel || levelInfo.level >= reward.requiredLevel),
  }));
}

export function getLifeAreaProgress(
  tasks: Task[],
  habits: Habit[],
  todayKey = getTodayKey(),
): LifeAreaProgress[] {
  return lifeAreaOptions.map((option) => {
    const areaTasks = tasks.filter((task) => task.category === option.area);
    const areaHabits = habits.filter((habit) => habit.category === option.area);
    const completedTasks = areaTasks.filter((task) => task.completed).length;
    const completedHabits = areaHabits.filter((habit) =>
      habit.completedDates.includes(todayKey),
    ).length;
    const total = areaTasks.length + areaHabits.length;
    const completed = completedTasks + completedHabits;

    return {
      area: option.area,
      completed,
      emoji: option.emoji,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      total,
    };
  });
}
