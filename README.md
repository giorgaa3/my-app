# PulseBoard

A small, polished Task & Habit Tracker dashboard built with Next.js App Router,
TypeScript, Tailwind CSS, React components, and localStorage persistence.

## Features

- Dashboard welcome panel with task and habit progress
- Statistics for total tasks, completed tasks, active habits, and completion rate
- Add, complete, uncomplete, filter, and delete tasks
- Add, complete today, track streaks, and delete habits
- Local-first persistence through `localStorage`
- Responsive layout for desktop and mobile

## Folder Structure

```txt
app/
  globals.css
  layout.tsx
  page.tsx
components/
  dashboard/
    Dashboard.tsx
    StatsGrid.tsx
    WelcomePanel.tsx
  habits/
    HabitSection.tsx
  tasks/
    TaskSection.tsx
  ui/
    EmptyState.tsx
    Icon.tsx
    StatCard.tsx
hooks/
  useLocalStorage.ts
lib/
  date.ts
  id.ts
  types.ts
  utils.ts
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run build
```
