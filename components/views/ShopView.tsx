"use client";

import Link from "next/link";

import { AvatarPreview } from "@/components/avatar/AvatarPreview";
import { CosmeticItemCard } from "@/components/avatar/CosmeticItemCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLifeQuest } from "@/components/providers/LifeQuestProvider";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { avatarItems } from "@/data/avatar-items";
import { useLanguage } from "@/hooks/use-language";
import { avatarCategories, getAvatarCompletionPercentage } from "@/lib/avatar";
import { getAvatarCategoryLabelKey } from "@/lib/i18n";
import { getLevelInfo } from "@/lib/lifequest";

export function ShopView() {
  const {
    avatar,
    buyAvatarItem,
    equipAvatarItem,
    profile,
    unequipAvatarCategory,
  } = useLifeQuest();
  const { t } = useLanguage();
  const levelInfo = getLevelInfo(profile.xp);
  const ownedCount = avatar.ownedItemIds.length;
  const completion = getAvatarCompletionPercentage(avatar);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        action={
          <div className="accent-badge inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold">
            <Icon name="coins" className="h-4 w-4" />
            {profile.coins} {t("common.coins")}
          </div>
        }
        description={t("shop.description")}
        eyebrow={t("shop.eyebrow")}
        title={t("shop.title")}
      />

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <AvatarPreview avatar={avatar} profile={profile} />

        <section className="dashboard-card rounded-2xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-muted text-sm font-semibold uppercase">
                {t("profile.customizeTitle")}
              </p>
              <h2 className="section-title mt-2 text-2xl font-semibold">
                {t("avatar.previewTitle")}
              </h2>
              <p className="section-muted mt-2 max-w-xl text-sm leading-6">
                {t("shop.previewHelper")}
              </p>
            </div>
            <Link
              className="primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
              href="/profile"
            >
              <Icon name="flag" className="h-4 w-4" />
              {t("nav.profile.label")}
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={t("shop.coinBalance")}
              value={profile.coins}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("shop.currentLevel")}
              value={levelInfo.level}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("shop.ownedItems")}
              value={`${ownedCount}/${avatarItems.length}`}
              valueSize="md"
              variant="soft"
            />
            <MetricCard
              label={t("shop.completion")}
              value={`${completion}%`}
              valueSize="md"
              variant="soft"
            />
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-muted text-sm font-semibold uppercase">
              {t("shop.allItems")}
            </p>
            <h2 className="section-title mt-2 text-2xl font-semibold">
              {t("profile.customizeTitle")}
            </h2>
          </div>
          <span className="accent-badge w-fit rounded-xl px-3 py-2 text-sm font-semibold">
            {avatarItems.length} {t("shop.allItems")}
          </span>
        </div>

        {avatarCategories.map((category) => {
          const items = avatarItems.filter((item) => item.category === category);

          return (
            <div className="flex flex-col gap-3" key={category}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="section-title text-lg font-semibold">
                  {t(getAvatarCategoryLabelKey(category))}
                </h3>
                <span className="section-muted text-sm font-semibold">
                  {t("shop.categoryCount", { count: items.length })}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <CosmeticItemCard
                    avatar={avatar}
                    coins={profile.coins}
                    item={item}
                    key={item.id}
                    level={levelInfo.level}
                    onBuy={buyAvatarItem}
                    onEquip={equipAvatarItem}
                    onUnequip={unequipAvatarCategory}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
