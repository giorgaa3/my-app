import { Icon } from "@/components/ui/Icon";
import type { DashboardStats } from "@/lib/types";

type WelcomePanelProps = {
  activeTasks: number;
  bestStreak: number;
  completedHabitsToday: number;
  stats: DashboardStats;
  totalHabits: number;
};

export function WelcomePanel({
  activeTasks,
  bestStreak,
  completedHabitsToday,
  stats,
  totalHabits,
}: WelcomePanelProps) {
  const progressDegrees = stats.completionPercentage * 3.6;
  const habitProgress =
    totalHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalHabits) * 100);

  return (
    <section className="dashboard-card hero-panel overflow-hidden rounded-lg p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div>
          <div className="accent-badge inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold">
            <Icon name="spark" className="h-4 w-4" />
            Today&apos;s focus
          </div>
          <h1 className="section-title mt-5 text-3xl font-semibold sm:text-4xl">
            Level up your real life, one quest at a time.
          </h1>
          <p className="section-muted mt-3 max-w-2xl text-base leading-7">
            Tasks, habits, and focus sessions now feed XP, coins, achievements,
            and life-area progress.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="soft-card rounded-lg px-4 py-3">
              <p className="section-muted text-sm font-medium">Active tasks</p>
              <p className="section-title mt-1 text-xl font-semibold">
                {activeTasks}
              </p>
            </div>
            <div className="soft-card rounded-lg px-4 py-3">
              <p className="section-muted text-sm font-medium">
                Best streak
              </p>
              <p className="section-title mt-1 text-xl font-semibold">
                {bestStreak} days
              </p>
            </div>
            <div className="soft-card rounded-lg px-4 py-3">
              <p className="section-muted text-sm font-medium">
                Habits today
              </p>
              <p className="section-title mt-1 text-xl font-semibold">
                {completedHabitsToday}/{totalHabits}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="soft-card rounded-lg px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="section-muted text-sm font-medium">
                  Task completion
                </p>
                <p className="section-title text-sm font-semibold">
                  {stats.completionPercentage}%
                </p>
              </div>
              <div className="progress-track mt-3">
                <div
                  className="progress-bar"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="soft-card rounded-lg px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="section-muted text-sm font-medium">
                  Habit check-ins
                </p>
                <p className="section-title text-sm font-semibold">
                  {habitProgress}%
                </p>
              </div>
              <div className="progress-track mt-3">
                <div
                  className="progress-bar"
                  style={{ width: `${habitProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div
            className="relative flex h-44 w-44 items-center justify-center rounded-full shadow-[0_18px_45px_rgb(20_184_166/0.18)]"
            style={{
              background: `conic-gradient(#14b8a6 ${progressDegrees}deg, color-mix(in srgb, var(--muted) 16%, transparent) 0deg)`,
            }}
          >
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[var(--surface)] text-center shadow-inner">
              <span className="section-title text-4xl font-semibold">
                {stats.completionPercentage}%
              </span>
              <span className="section-muted mt-1 text-xs font-semibold uppercase">
                complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
