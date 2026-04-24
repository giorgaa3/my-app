"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import {
  calculateStreak,
  formatShortDate,
  getLastSevenDateKeys,
} from "@/lib/date";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

type HabitSectionProps = {
  habits: Habit[];
  onAddHabit: (name: string) => boolean;
  onDeleteHabit: (habitId: string) => void;
  onToggleToday: (habitId: string) => void;
  todayKey: string;
};

export function HabitSection({
  habits,
  onAddHabit,
  onDeleteHabit,
  onToggleToday,
  todayKey,
}: HabitSectionProps) {
  const [habitName, setHabitName] = useState("");
  const [message, setMessage] = useState("");
  const weekKeys = getLastSevenDateKeys(todayKey);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasAdded = onAddHabit(habitName);

    if (!wasAdded) {
      setMessage("Use a new habit name.");
      return;
    }

    setHabitName("");
    setMessage("");
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Habits
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Daily streaks
        </h2>

        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => {
              setHabitName(event.target.value);
              setMessage("");
            }}
            placeholder="Add a habit"
            value={habitName}
          />
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:translate-y-0 disabled:bg-slate-300"
            disabled={!habitName.trim()}
            type="submit"
          >
            <Icon name="plus" className="h-4 w-4" />
            Add habit
          </button>
          <p aria-live="polite" className="min-h-5 text-sm text-rose-600">
            {message}
          </p>
        </form>
      </div>

      <div className="p-4 sm:p-5">
        {habits.length > 0 ? (
          <ul className="overflow-hidden rounded-lg border border-slate-200">
            {habits.map((habit) => (
              <HabitRow
                habit={habit}
                key={habit.id}
                onDeleteHabit={onDeleteHabit}
                onToggleToday={onToggleToday}
                todayKey={todayKey}
                weekKeys={weekKeys}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            description="Create a small repeatable routine and check it off each day."
            icon="flame"
            title="No habits yet"
          />
        )}
      </div>
    </section>
  );
}

type HabitRowProps = {
  habit: Habit;
  onDeleteHabit: (habitId: string) => void;
  onToggleToday: (habitId: string) => void;
  todayKey: string;
  weekKeys: string[];
};

function HabitRow({
  habit,
  onDeleteHabit,
  onToggleToday,
  todayKey,
  weekKeys,
}: HabitRowProps) {
  const completedToday = habit.completedDates.includes(todayKey);
  const streak = calculateStreak(habit.completedDates, todayKey);

  return (
    <li className="border-b border-slate-200 px-4 py-4 last:border-b-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-950">
            {habit.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {streak} day streak
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus:outline-none focus:ring-4",
              completedToday
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-100"
                : "bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-200",
            )}
            onClick={() => onToggleToday(habit.id)}
            type="button"
          >
            <Icon
              name={completedToday ? "checkCircle" : "circle"}
              className="h-4 w-4"
            />
            {completedToday ? "Done today" : "Mark today"}
          </button>
          <button
            aria-label={`Delete ${habit.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
            onClick={() => onDeleteHabit(habit.id)}
            type="button"
          >
            <Icon name="trash" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {weekKeys.map((dateKey) => {
          const completed = habit.completedDates.includes(dateKey);

          return (
            <div className="min-w-0 text-center" key={dateKey}>
              <p className="truncate text-[11px] font-semibold text-slate-500">
                {formatShortDate(dateKey)}
              </p>
              <div
                className={cn(
                  "mt-1 flex h-8 items-center justify-center rounded-md border text-xs font-semibold transition",
                  completed
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-300",
                )}
                title={dateKey}
              >
                {completed ? <Icon name="check" className="h-4 w-4" /> : ""}
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
}
