"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLanguage } from "@/hooks/use-language";
import {
  getAvatarWithPreviewItem,
  rarityAccentClasses,
} from "@/lib/avatar-renderer";
import {
  getAvatarCategoryLabelKey,
  getAvatarItemNameKey,
  getAvatarRarityLabelKey,
} from "@/lib/i18n";
import type { AvatarItem, AvatarItemCategory, UserAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";

type OwnedItemsSectionProps = {
  avatar: UserAvatar;
  items: AvatarItem[];
  onEquip: (item: AvatarItem) => void;
  onUnequip: (category: AvatarItemCategory) => void;
};

const ownedCategories: AvatarItemCategory[] = [
  "hair",
  "top",
  "pants",
  "shoes",
  "accessory",
  "background",
  "frame",
];

export function OwnedItemsSection({
  avatar,
  items,
  onEquip,
  onUnequip,
}: OwnedItemsSectionProps) {
  const { t } = useLanguage();
  const ownedItems = items.filter((item) => avatar.ownedItemIds.includes(item.id));

  if (ownedItems.length === 0) {
    return (
      <EmptyState
        description={t("profile.noOwnedItems")}
        icon="shoppingBag"
        title={t("profile.ownedItems")}
      />
    );
  }

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-muted text-sm font-semibold uppercase">
            {t("shop.ownedItems")}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            {t("profile.ownedItems")}
          </h2>
          <p className="section-muted mt-2 max-w-2xl text-sm leading-6">
            {t("profile.ownedItemsDescription")}
          </p>
        </div>
        <span className="accent-badge w-fit rounded-xl px-3 py-2 text-sm font-semibold">
          {ownedItems.length}/{items.length}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {ownedCategories.map((category) => {
          const categoryItems = ownedItems.filter(
            (item) => item.category === category,
          );

          if (categoryItems.length === 0) {
            return null;
          }

          return (
            <div className="flex flex-col gap-3" key={category}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="section-title text-lg font-semibold">
                  {t(getAvatarCategoryLabelKey(category))}
                </h3>
                <span className="section-muted text-sm font-semibold">
                  {t("shop.categoryCount", { count: categoryItems.length })}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {categoryItems.map((item) => {
                  const equipped = avatar.equipped[item.category] === item.id;

                  return (
                    <article
                      className={cn(
                        "soft-card rounded-2xl p-4 transition hover:-translate-y-0.5",
                        equipped ? "border-[var(--brand)]" : "",
                      )}
                      key={item.id}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-2xl bg-gradient-to-br p-1 shadow-sm",
                            rarityAccentClasses[item.rarity],
                          )}
                        >
                          <AvatarCanvas
                            avatar={getAvatarWithPreviewItem(avatar, item)}
                            size="xs"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="section-title truncate text-sm font-semibold">
                            {t(getAvatarItemNameKey(item.id))}
                          </p>
                          <p className="section-muted mt-1 text-xs font-semibold uppercase">
                            {t(getAvatarCategoryLabelKey(item.category))}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
                              {t(getAvatarRarityLabelKey(item.rarity))}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs font-semibold",
                                equipped
                                  ? "accent-badge"
                                  : "border border-[var(--border)] text-[var(--muted)]",
                              )}
                            >
                              {equipped ? t("shop.equipped") : t("shop.owned")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          className="accent-button inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-45"
                          disabled={equipped}
                          onClick={() => onEquip(item)}
                          type="button"
                        >
                          {t("shop.equip")}
                        </button>
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--foreground)] disabled:opacity-45"
                          disabled={!equipped}
                          onClick={() => onUnequip(item.category)}
                          type="button"
                        >
                          {t("shop.unequip")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
