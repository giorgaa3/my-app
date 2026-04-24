# LifeQuest

A polished productivity RPG dashboard built with Next.js App Router,
TypeScript, Tailwind CSS, React components, and localStorage persistence.

## Features

- XP, levels, level titles, avatar progression, coins, and daily streaks
- Daily Quest Board with date-based quest progress and rewards
- Tasks with edit, priority, due dates, search, filters, and life areas
- Habits with emoji badges, life areas, streaks, reset, and weekly progress
- Pomodoro-style Focus Arena with task selection and session rewards
- Character card, achievements, reward shop previews, and life area progress
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
  lifequest/
    AchievementsPanel.tsx
    CharacterCard.tsx
    DailyQuestBoard.tsx
    FocusArena.tsx
    LifeAreasGrid.tsx
    RewardShop.tsx
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
  lifeAreas.ts
  lifequest.ts
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
