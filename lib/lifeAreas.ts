import type { LifeArea } from "@/lib/types";

export const lifeAreaOptions: Array<{
  area: LifeArea;
  emoji: string;
  description: string;
}> = [
  { area: "Work", description: "Career, projects, and execution", emoji: "💼" },
  { area: "Learning", description: "Study, reading, and skill growth", emoji: "📘" },
  { area: "Health", description: "Body, energy, and recovery", emoji: "💚" },
  { area: "Money", description: "Finance, saving, and planning", emoji: "🪙" },
  { area: "Personal", description: "Home, relationships, and life admin", emoji: "🏡" },
  { area: "Creative", description: "Writing, design, and making things", emoji: "🎨" },
];

const legacyAreaMap: Record<string, LifeArea> = {
  Fitness: "Health",
  Focus: "Work",
  Home: "Personal",
  Wellness: "Health",
};

export function normalizeLifeArea(value: unknown): LifeArea {
  if (typeof value !== "string") {
    return "Work";
  }

  const directMatch = lifeAreaOptions.find((option) => option.area === value);

  if (directMatch) {
    return directMatch.area;
  }

  return legacyAreaMap[value] ?? "Work";
}

export function getLifeAreaOption(area: LifeArea) {
  return (
    lifeAreaOptions.find((option) => option.area === area) ?? lifeAreaOptions[0]
  );
}
