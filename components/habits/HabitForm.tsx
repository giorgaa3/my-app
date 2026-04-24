"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Icon } from "@/components/ui/Icon";
import { habitCategoryOptions } from "@/lib/habits";
import type { HabitInput } from "@/lib/types";

type HabitFormProps = {
  onAddHabit: (habit: HabitInput) => void;
};

export function HabitForm({ onAddHabit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState<string>(habitCategoryOptions[0].icon);
  const [category, setCategory] = useState<string>(
    habitCategoryOptions[0].label,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddHabit({
      category,
      emoji: emoji.trim() || habitCategoryOptions[0].icon,
      name: name.trim(),
    });

    setName("");
    setEmoji(habitCategoryOptions[0].icon);
    setCategory(habitCategoryOptions[0].label);
  }

  return (
    <form
      className="mt-5 grid gap-3 sm:grid-cols-[76px_minmax(0,1fr)]"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Icon
        </span>
        <input
          className="field-control rounded-lg px-3 text-center text-lg"
          maxLength={2}
          onChange={(event) => setEmoji(event.target.value)}
          value={emoji}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Habit name
        </span>
        <input
          className="field-control rounded-lg px-4 text-sm"
          onChange={(event) => setName(event.target.value)}
          placeholder="Example: Read for 20 minutes"
          value={name}
        />
      </label>

      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="section-muted text-xs font-semibold uppercase">
          Category
        </span>
        <select
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          {habitCategoryOptions.map((option) => (
            <option key={option.label} value={option.label}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end sm:col-span-2">
        <button
          className="accent-button inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:translate-y-0 disabled:opacity-45"
          disabled={!name.trim()}
          type="submit"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add habit
        </button>
      </div>
    </form>
  );
}
