"use client";

import { FocusArena } from "@/components/lifequest/FocusArena";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import type { TranslationKey } from "@/lib/i18n";
import {
  FOCUS_REWARD,
  getFocusSessionsToday,
  getLevelInfo,
} from "@/lib/lifequest";

const arenaRules: Array<{ icon: IconName; textKey: TranslationKey }> = [
  {
    icon: "list",
    textKey: "focus.rule1",
  },
  {
    icon: "circle",
    textKey: "focus.rule2",
  },
  {
    icon: "spark",
    textKey: "focus.rule3",
  },
];

export function FocusView() {
  const { completeFocusSession, profile, tasks, todayKey } = useLifeQuest();
  const { t } = useLanguage();
  const sessionsToday = getFocusSessionsToday(profile, todayKey);
  const levelInfo = getLevelInfo(profile.xp);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="target" className="h-4 w-4" />
            {t("focus.completedToday", { count: sessionsToday })}
          </div>
        }
        description={t("focus.description")}
        eyebrow={t("focus.eyebrow")}
        title={t("focus.title")}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label={t("focus.sessionReward")}
          value={`+${FOCUS_REWARD.xp} XP`}
        />
        <MetricCard
          label={t("focus.coinReward")}
          value={`+${FOCUS_REWARD.coins}`}
        />
        <MetricCard label={t("common.currentLevel")} value={levelInfo.level} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <FocusArena onCompleteSession={completeFocusSession} tasks={tasks} />

        <aside className="dashboard-card rounded-2xl p-5">
          <p className="section-muted text-sm font-semibold uppercase">
            {t("focus.rulesEyebrow")}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            {t("focus.rulesTitle")}
          </h2>
          <div className="mt-5 grid gap-3">
            {arenaRules.map((rule) => (
              <RuleCard icon={rule.icon} key={rule.textKey} text={t(rule.textKey)} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function RuleCard({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="soft-card flex items-start gap-3 rounded-2xl p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand)]">
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <p className="section-muted text-sm leading-6">{text}</p>
    </div>
  );
}
