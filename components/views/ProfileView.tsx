"use client";

import Link from "next/link";

import { AvatarPreview } from "@/components/avatar/AvatarPreview";
import { EquippedLoadoutSection } from "@/components/avatar/EquippedLoadoutSection";
import { OwnedItemsSection } from "@/components/avatar/OwnedItemsSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LifeAreasGrid } from "@/components/lifequest/LifeAreasGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { avatarItems } from "@/data/avatar-items";
import { useLanguage } from "@/hooks/use-language";
import { getAvatarCompletionPercentage } from "@/lib/avatar";
import { getLevelTitleKey } from "@/lib/i18n";
import { getDailyStreak, getLevelInfo } from "@/lib/lifequest";

export function ProfileView() {
  const {
    avatar,
    habits,
    profile,
    stats,
    tasks,
    todayKey,
    equipAvatarItem,
    unequipAvatarCategory,
  } = useLifeQuest();
  const { t } = useLanguage();
  const levelInfo = getLevelInfo(profile.xp);
  const dailyStreak = getDailyStreak(profile.activeDates, todayKey);
  const avatarCompletion = getAvatarCompletionPercentage(avatar);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="flag" className="h-4 w-4" />
            {t("common.level")} {levelInfo.level} /{" "}
            {t(getLevelTitleKey(levelInfo.title))}
          </div>
        }
        description={t("profile.description")}
        eyebrow={t("profile.eyebrow")}
        title={t("profile.title")}
      />

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <AvatarPreview avatar={avatar} profile={profile} />

        <section className="dashboard-card rounded-2xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-muted text-sm font-semibold uppercase">
                {t("profile.mainStats")}
              </p>
              <h2 className="section-title mt-2 text-2xl font-semibold">
                {t("profile.progressSnapshot")}
              </h2>
              <p className="section-muted mt-2 text-sm leading-6">
                {t("profile.customizeDescription")}
              </p>
            </div>
            <Link
              className="primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
              href="/shop"
            >
              <Icon name="shoppingBag" className="h-4 w-4" />
              {t("profile.openShop")}
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MetricCard
              label={t("dashboard.totalXp")}
              value={profile.xp}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("common.coins")}
              value={profile.coins}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.streak")}
              value={`${dailyStreak}${t("common.daysShort")}`}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.focusSessions")}
              value={profile.completedFocusSessions}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.tasksCompleted")}
              value={profile.totalTaskCompletions}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("profile.habitCheckIns")}
              value={profile.totalHabitCompletions}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("shop.completion")}
              value={`${avatarCompletion}%`}
              valueSize="md"
              variant="soft"
            />
          </div>
        </section>
      </div>

      <EquippedLoadoutSection
        avatar={avatar}
        onUnequip={unequipAvatarCategory}
      />
      <OwnedItemsSection
        avatar={avatar}
        items={avatarItems}
        onEquip={equipAvatarItem}
        onUnequip={unequipAvatarCategory}
      />
      <StatsGrid stats={stats} />
      <LifeAreasGrid habits={habits} tasks={tasks} todayKey={todayKey} />
    </div>
  );
}
