"use client";

import { useLanguage } from "@/hooks/use-language";
import { getLifeAreaLabelKey } from "@/lib/i18n";
import { getLifeAreaProgress } from "@/lib/lifequest";
import type { Habit, Task } from "@/lib/types";

type LifeAreasGridProps = {
  habits: Habit[];
  tasks: Task[];
  todayKey: string;
};

export function LifeAreasGrid({ habits, tasks, todayKey }: LifeAreasGridProps) {
  const areas = getLifeAreaProgress(tasks, habits, todayKey);
  const { t } = useLanguage();

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex flex-col gap-2">
        <p className="section-muted text-sm font-semibold uppercase">
          {t("lifeAreas.eyebrow")}
        </p>
        <h2 className="section-title text-2xl font-semibold">
          {t("lifeAreas.title")}
        </h2>
        <p className="section-muted max-w-2xl text-sm leading-6">
          {t("lifeAreas.description")}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {areas.map((area) => (
          <article className="soft-card rounded-2xl p-4" key={area.area}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl">{area.emoji}</span>
              <span className="section-muted text-xs font-semibold">
                {area.progress}%
              </span>
            </div>
            <h3 className="section-title mt-3 text-sm font-semibold">
              {t(getLifeAreaLabelKey(area.area))}
            </h3>
            <p className="section-muted mt-1 text-xs font-medium">
              {area.completed}/{area.total} {t("common.actions")}
            </p>
            <div className="progress-track mt-3">
              <div className="progress-bar" style={{ width: `${area.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
