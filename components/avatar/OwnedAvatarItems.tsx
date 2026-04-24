"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLanguage } from "@/hooks/use-language";
import { avatarCategories, getEquippedItems } from "@/lib/avatar";
import {
  getPreviewAvatarForItem,
  rarityAccentClasses,
} from "@/lib/avatar-renderer";
import {
  getAvatarCategoryLabelKey,
  getAvatarItemNameKey,
  getAvatarRarityLabelKey,
} from "@/lib/i18n";
import type { AvatarItem, UserAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";

type OwnedAvatarItemsProps = {
  avatar: UserAvatar;
  items: AvatarItem[];
};

export function OwnedAvatarItems({ avatar, items }: OwnedAvatarItemsProps) {
  const { t } = useLanguage();
  const equippedItems = getEquippedItems(avatar, items);
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
            {t("avatar.equippedLoadout")}
          </h2>
        </div>
        <span className="accent-badge w-fit rounded-xl px-3 py-2 text-sm font-semibold">
          {ownedItems.length}/{items.length}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ownedItems.map((item) => {
          const equipped = equippedItems[item.category]?.id === item.id;

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
                    "rounded-xl bg-gradient-to-br p-1 shadow-sm",
                    rarityAccentClasses[item.rarity],
                  )}
                >
                  <AvatarCanvas
                    avatar={getPreviewAvatarForItem(item)}
                    size="sm"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="section-title truncate text-sm font-semibold">
                    {t(getAvatarItemNameKey(item.id))}
                  </p>
                  <p className="section-muted mt-1 text-xs font-semibold uppercase">
                    {t(getAvatarCategoryLabelKey(item.category))}
                  </p>
                </div>
                {equipped ? (
                  <span className="accent-badge rounded-full px-2 py-1 text-xs font-semibold">
                    {t("shop.equipped")}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                  {t(getAvatarRarityLabelKey(item.rarity))}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                  {t(getAvatarCategoryLabelKey(item.category))}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {avatarCategories.map((category) => {
          const item = equippedItems[category];

          return (
            <div className="soft-card rounded-xl px-3 py-2" key={category}>
              <p className="section-muted text-xs font-semibold uppercase">
                {t(getAvatarCategoryLabelKey(category))}
              </p>
              <p className="section-title mt-1 truncate text-sm font-semibold">
                {item ? t(getAvatarItemNameKey(item.id)) : t("avatar.slotEmpty")}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
