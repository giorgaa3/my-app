"use client";

import { useLanguage } from "@/hooks/use-language";
import {
  getAchievementDescriptionKey,
  getAchievementTitleKey,
} from "@/lib/i18n";
import { getAchievements } from "@/lib/lifequest";
import type { LifeQuestProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type AchievementsPanelProps = {
  profile: LifeQuestProfile;
  todayKey: string;
};

export function AchievementsPanel({ profile, todayKey }: AchievementsPanelProps) {
  const achievements = getAchievements(profile, todayKey);
  const { t } = useLanguage();

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <p className="section-muted text-sm font-semibold uppercase">
        {t("achievements.panel.eyebrow")}
      </p>
      <h2 className="section-title mt-1 text-2xl font-semibold">
        {t("achievements.panel.title")}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <article
            className={cn(
              "rounded-2xl border p-4 transition",
              achievement.unlocked
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-[var(--border)] bg-[var(--surface-muted)] opacity-70",
            )}
            key={achievement.id}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                {achievement.unlocked ? achievement.icon : "🔒"}
              </div>
              <div>
                <h3 className="text-sm font-semibold">
                  {t(getAchievementTitleKey(achievement.id))}
                </h3>
                <p className="mt-1 text-sm leading-5 opacity-75">
                  {t(getAchievementDescriptionKey(achievement.id))}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
