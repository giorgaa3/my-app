"use client";

import { useLanguage } from "@/hooks/use-language";
import { getLevelTitleKey } from "@/lib/i18n";
import { getDailyStreak, getLevelInfo } from "@/lib/lifequest";
import type { LifeQuestProfile } from "@/lib/types";

type CharacterCardProps = {
  profile: LifeQuestProfile;
  todayKey: string;
};

export function CharacterCard({ profile, todayKey }: CharacterCardProps) {
  const levelInfo = getLevelInfo(profile.xp);
  const dailyStreak = getDailyStreak(profile.activeDates, todayKey);
  const { t } = useLanguage();

  return (
    <section className="dashboard-card lifequest-card rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-5xl shadow-inner">
          {levelInfo.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase text-white/70">
            {t("profile.characterCard.eyebrow")}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {t("common.level")} {levelInfo.level}{" "}
            {t(getLevelTitleKey(levelInfo.title))}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {t("profile.characterCard.description")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <CharacterMetric label={t("common.xp")} value={profile.xp} />
        <CharacterMetric label={t("common.coins")} value={profile.coins} />
        <CharacterMetric
          label={t("profile.streak")}
          value={`${dailyStreak}${t("common.daysShort")}`}
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/80">
          <span>{t("profile.nextLevel")}</span>
          <span>{t("dashboard.nextLevel", { xp: levelInfo.xpToNextLevel })}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#93c5fd,#c4b5fd,#6ee7b7)]"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-white/65">
          {t("profile.xpThroughLevel", {
            current: levelInfo.xpIntoLevel,
            target: levelInfo.nextLevelXp - levelInfo.currentLevelXp,
          })}
        </p>
      </div>
    </section>
  );
}

type CharacterMetricProps = {
  label: string;
  value: number | string;
};

function CharacterMetric({ label, value }: CharacterMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
      <p className="text-xs font-semibold uppercase text-white/60">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
