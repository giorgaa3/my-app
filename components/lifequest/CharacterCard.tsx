import { getDailyStreak, getLevelInfo } from "@/lib/lifequest";
import type { LifeQuestProfile } from "@/lib/types";

type CharacterCardProps = {
  profile: LifeQuestProfile;
  todayKey: string;
};

export function CharacterCard({ profile, todayKey }: CharacterCardProps) {
  const levelInfo = getLevelInfo(profile.xp);
  const dailyStreak = getDailyStreak(profile.activeDates, todayKey);

  return (
    <section className="dashboard-card lifequest-card rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-5xl shadow-inner">
          {levelInfo.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase text-white/70">
            LifeQuest Character
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Level {levelInfo.level} {levelInfo.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Real-life progress, converted into XP, coins, and momentum.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <CharacterMetric label="XP" value={profile.xp} />
        <CharacterMetric label="Coins" value={profile.coins} />
        <CharacterMetric label="Streak" value={`${dailyStreak}d`} />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/80">
          <span>Next level</span>
          <span>{levelInfo.xpToNextLevel} XP left</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#93c5fd,#c4b5fd,#6ee7b7)]"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-white/65">
          {levelInfo.xpIntoLevel}/{levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP
          through this level
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
