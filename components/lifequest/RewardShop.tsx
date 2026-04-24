"use client";

import { useLanguage } from "@/hooks/use-language";
import {
  getRewardDescriptionKey,
  getRewardTitleKey,
} from "@/lib/i18n";
import { getRewardItems } from "@/lib/lifequest";
import type { LifeQuestProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type RewardShopProps = {
  profile: LifeQuestProfile;
};

export function RewardShop({ profile }: RewardShopProps) {
  const rewards = getRewardItems(profile);
  const { t } = useLanguage();

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex flex-col gap-2">
        <p className="section-muted text-sm font-semibold uppercase">
          {t("reward.shop.eyebrow")}
        </p>
        <h2 className="section-title text-2xl font-semibold">
          {t("reward.shop.title")}
        </h2>
        <p className="section-muted text-sm leading-6">
          {t("reward.shop.description")}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {rewards.map((reward) => (
          <article
            className={cn(
              "rounded-2xl border p-4",
              reward.unlocked
                ? "border-violet-200 bg-violet-50"
                : "border-[var(--border)] bg-[var(--surface-muted)]",
            )}
            key={reward.id}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                {reward.unlocked ? reward.icon : "🔒"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="section-title text-sm font-semibold">
                    {t(getRewardTitleKey(reward.id))}
                  </h3>
                  <span className="section-muted text-xs font-semibold">
                    {t("reward.cost", { cost: reward.cost })}
                  </span>
                </div>
                <p className="section-muted mt-1 text-sm leading-5">
                  {t(getRewardDescriptionKey(reward.id))}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
