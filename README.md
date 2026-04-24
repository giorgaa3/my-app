# PulseBoard

A small, polished Task & Habit Tracker dashboard built with Next.js App Router,
TypeScript, Tailwind CSS, React components, and localStorage persistence.

## Features

- Dashboard welcome panel with task and habit progress
- Statistics for total tasks, completed tasks, active habits, completion rate,
  overdue tasks, and high-priority tasks
- Add, edit, complete, uncomplete, filter, search, and delete tasks
- Task priority, due dates, overdue state, and task summary counters
- Add habits with an icon and category
- Complete today, reset progress, track current and best streaks, and delete habits
- Weekly habit progress view
- Light and dark mode saved locally
- Toast notifications for feedback
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
    HabitForm.tsx
    HabitRow.tsx
    HabitSection.tsx
  tasks/
    TaskFilters.tsx
    TaskForm.tsx
    TaskRow.tsx
    TaskSection.tsx
    TaskSummary.tsx
  ui/
    EmptyState.tsx
    Icon.tsx
    StatCard.tsx
    ThemeToggle.tsx
    Toast.tsx
hooks/
  useLocalStorage.ts
  useTheme.ts
  useToast.ts
lib/
  date.ts
  habits.ts
  id.ts
  tasks.ts
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
