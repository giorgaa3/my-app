import {
  calculateStreak,
  dedupeDateKeys,
  getLastSevenDateKeys,
  getTodayKey,
  shiftDateKey,
} from "@/lib/date";
import type { Habit } from "@/lib/types";

type StoredHabit = Partial<Habit> & {
  id: string;
  name: string;
};

export function normalizeHabits(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((habit): habit is StoredHabit => {
      if (!habit || typeof habit !== "object") {
        return false;
      }

      const storedHabit = habit as Partial<StoredHabit>;
      return Boolean(storedHabit.id && storedHabit.name);
    })
    .map((habit) => ({
      category: habit.category || "Wellness",
      completedDates: dedupeDateKeys(habit.completedDates ?? []),
      createdAt: habit.createdAt ?? new Date().toISOString(),
      emoji: habit.emoji || "*",
      id: String(habit.id),
      name: String(habit.name),
    }));
}

export function isHabitCompletedToday(habit: Habit, todayKey = getTodayKey()) {
  return habit.completedDates.includes(todayKey);
}

export function getBestStreak(completedDates: string[]) {
  const sortedDates = dedupeDateKeys(completedDates);
  let bestStreak = 0;
  let currentStreak = 0;
  let previousDate = "";

  sortedDates.forEach((dateKey) => {
    const followsPrevious =
      previousDate !== "" && shiftDateKey(previousDate, 1) === dateKey;

    currentStreak = followsPrevious ? currentStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    previousDate = dateKey;
  });

  return bestStreak;
}

export function getWeeklyHabitProgress(habit: Habit, todayKey = getTodayKey()) {
  const weekKeys = getLastSevenDateKeys(todayKey);
  const completedCount = weekKeys.filter((dateKey) =>
    habit.completedDates.includes(dateKey),
  ).length;

  return {
    completedCount,
    percentage: Math.round((completedCount / weekKeys.length) * 100),
    weekKeys,
  };
}

export function getHabitDashboardSummary(
  habits: Habit[],
  todayKey = getTodayKey(),
) {
  const completedToday = habits.filter((habit) =>
    isHabitCompletedToday(habit, todayKey),
  ).length;
  const bestStreak = habits.reduce(
    (best, habit) => Math.max(best, getBestStreak(habit.completedDates)),
    0,
  );
  const currentStreak = habits.reduce(
    (best, habit) =>
      Math.max(best, calculateStreak(habit.completedDates, todayKey)),
    0,
  );

  return {
    bestStreak,
    completedToday,
    currentStreak,
    total: habits.length,
  };
}
