import { Icon } from "@/components/ui/Icon";
import type { DashboardStats } from "@/lib/types";

type WelcomePanelProps = {
  activeTasks: number;
  bestStreak: number;
  stats: DashboardStats;
};

export function WelcomePanel({
  activeTasks,
  bestStreak,
  stats,
}: WelcomePanelProps) {
  const progressDegrees = stats.completionPercentage * 3.6;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">
            <Icon name="spark" className="h-4 w-4" />
            Today&apos;s command center
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Welcome back.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Keep the important work visible, close the loop on small tasks, and
            protect the habits that compound.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-500">Active tasks</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {activeTasks}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-500">
                Best streak
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {bestStreak} days
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {stats.completedTasks}/{stats.totalTasks}
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
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
              <span className="text-4xl font-semibold text-slate-950">
                {stats.completionPercentage}%
              </span>
              <span className="mt-1 text-xs font-semibold uppercase text-slate-500">
                complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
