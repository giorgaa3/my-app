"use client";

import Link from "next/link";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { avatarItems } from "@/data/avatar-items";
import { useLanguage } from "@/hooks/use-language";
import { getEquippedItems } from "@/lib/avatar";
import {
  getAvatarWithPreviewItem,
  getAvatarWithoutCategory,
} from "@/lib/avatar-renderer";
import {
  getAvatarCategoryLabelKey,
  getAvatarItemNameKey,
  getAvatarRarityLabelKey,
} from "@/lib/i18n";
import type { AvatarItemCategory, UserAvatar } from "@/lib/types";

type EquippedLoadoutSectionProps = {
  avatar: UserAvatar;
  onUnequip: (category: AvatarItemCategory) => void;
};

const loadoutCategories: AvatarItemCategory[] = [
  "hair",
  "top",
  "pants",
  "shoes",
  "accessory",
  "background",
  "frame",
];

const defaultCategories = new Set<AvatarItemCategory>([
  "hair",
  "top",
  "pants",
  "shoes",
]);

export function EquippedLoadoutSection({
  avatar,
  onUnequip,
}: EquippedLoadoutSectionProps) {
  const { t } = useLanguage();
  const equippedItems = getEquippedItems(avatar, avatarItems);

  return (
    <section className="dashboard-card rounded-2xl p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-muted text-sm font-semibold uppercase">
            {t("avatar.equippedLoadout")}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            {t("profile.equippedLoadoutTitle")}
          </h2>
          <p className="section-muted mt-2 max-w-2xl text-sm leading-6">
            {t("profile.equippedLoadoutDescription")}
          </p>
        </div>
        <Link
          className="primary-button inline-flex min-h-11 w-fit items-center justify-center rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
          href="/shop"
        >
          {t("shop.change")}
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {loadoutCategories.map((category) => {
          const item = equippedItems[category];
          const thumbnailAvatar = item
            ? getAvatarWithPreviewItem(avatar, item)
            : getAvatarWithoutCategory(avatar, category);
          const stateLabel = defaultCategories.has(category)
            ? t("shop.default")
            : t("shop.none");

          return (
            <article className="soft-card rounded-2xl p-3" key={category}>
              <div className="flex items-center gap-3">
                <AvatarCanvas avatar={thumbnailAvatar} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="section-muted text-xs font-semibold uppercase">
                    {t(getAvatarCategoryLabelKey(category))}
                  </p>
                  <p className="section-title mt-1 truncate text-sm font-semibold">
                    {item ? t(getAvatarItemNameKey(item.id)) : stateLabel}
                  </p>
                  <div className="mt-2">
                    {item ? (
                      <span className="accent-badge rounded-full px-2 py-1 text-xs font-semibold">
                        {t(getAvatarRarityLabelKey(item.rarity))}
                      </span>
                    ) : (
                      <span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
                        {stateLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--brand)]"
                  href="/shop"
                >
                  {t("shop.change")}
                </Link>
                <button
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--foreground)] disabled:opacity-45"
                  disabled={!item}
                  onClick={() => onUnequip(category)}
                  type="button"
                >
                  {t("shop.unequip")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
