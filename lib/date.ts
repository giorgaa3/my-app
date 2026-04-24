const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTodayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDateKey(dateKey: string, offset: number) {
  const date = parseDateKey(dateKey);
  return getTodayKey(new Date(date.getTime() + offset * DAY_IN_MS));
}

export function getLastSevenDateKeys(todayKey = getTodayKey()) {
  return Array.from({ length: 7 }, (_, index) =>
    shiftDateKey(todayKey, index - 6),
  );
}

export function calculateStreak(
  completedDates: string[],
  todayKey = getTodayKey(),
) {
  const completed = new Set(completedDates);
  let cursor = completed.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;

  // A streak stays visible until the current day is missed, so an unmarked
  // morning can still show the streak built through yesterday.
  while (completed.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(parseDateKey(dateKey));
}
