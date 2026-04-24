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

  return (
    <section className="dashboard-card rounded-lg p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">
            <Icon name="spark" className="h-4 w-4" />
            Today&apos;s command center
          </div>
          <h1 className="section-title mt-5 text-3xl font-semibold sm:text-4xl">
            Build momentum without losing the details.
          </h1>
          <p className="section-muted mt-3 max-w-2xl text-base leading-7">
            Tasks show what needs action next. Habits show the routines worth
            protecting. Everything saves in your browser automatically.
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
        </div>

        <div className="flex justify-center lg:justify-end">
          <div
            className="relative flex h-40 w-40 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#14b8a6 ${progressDegrees}deg, #e2e8f0 0deg)`,
            }}
          >
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[var(--surface)] text-center shadow-inner">
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
