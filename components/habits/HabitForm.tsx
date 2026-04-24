"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Icon } from "@/components/ui/Icon";
import type { HabitInput } from "@/lib/types";

type HabitFormProps = {
  onAddHabit: (habit: HabitInput) => void;
};

const categoryOptions = ["Wellness", "Focus", "Fitness", "Learning", "Home"];

export function HabitForm({ onAddHabit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("*");
  const [category, setCategory] = useState(categoryOptions[0]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddHabit({
      category,
      emoji: emoji.trim() || "*",
      name: name.trim(),
    });

    setName("");
    setEmoji("*");
    setCategory(categoryOptions[0]);
  }

  return (
    <form className="mt-5 grid gap-3 lg:grid-cols-[76px_1fr_150px_auto]" onSubmit={handleSubmit}>
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

      <label className="flex flex-col gap-1.5">
        <span className="section-muted text-xs font-semibold uppercase">
          Category
        </span>
        <select
          className="field-control rounded-lg px-3 text-sm"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end">
        <button
          className="accent-button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:translate-y-0 disabled:opacity-45 lg:w-auto"
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
