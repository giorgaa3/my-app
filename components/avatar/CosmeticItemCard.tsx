"use client";

import { useState } from "react";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/use-language";
import { getAvatarItemState } from "@/lib/avatar";
import type { AvatarItemState } from "@/lib/avatar";
import {
  getAvatarCategoryLabelKey,
  getAvatarItemDescriptionKey,
  getAvatarItemNameKey,
  getAvatarRarityLabelKey,
} from "@/lib/i18n";
import {
  getAvatarWithPreviewItem,
  getAvatarWithoutCategory,
  getPreviewAvatarForItem,
  rarityAccentClasses,
} from "@/lib/avatar-renderer";
import type { AvatarItem, AvatarItemCategory, UserAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";

type CosmeticItemCardProps = {
  avatar: UserAvatar;
  coins: number;
  item: AvatarItem;
  level: number;
  onBuy: (item: AvatarItem) => void;
  onEquip: (item: AvatarItem) => void;
  onUnequip: (category: AvatarItemCategory) => void;
};

const rarityClasses = {
  common:
    "border-slate-300/60 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-200",
  epic:
    "border-violet-300/70 bg-violet-100 text-violet-700 dark:border-violet-400/40 dark:bg-violet-400/15 dark:text-violet-200",
  legendary:
    "border-amber-300/80 bg-amber-100 text-amber-800 dark:border-amber-300/40 dark:bg-amber-300/15 dark:text-amber-200",
  rare:
    "border-sky-300/70 bg-sky-100 text-sky-700 dark:border-sky-400/40 dark:bg-sky-400/15 dark:text-sky-200",
} as const;

const stateCopy: Record<
  AvatarItemState,
  | "shop.buy"
  | "shop.equipped"
  | "shop.locked"
  | "shop.notEnoughCoins"
  | "shop.owned"
> = {
  buy: "shop.buy",
  equipped: "shop.equipped",
  locked: "shop.locked",
  "not-enough-coins": "shop.notEnoughCoins",
  owned: "shop.owned",
};

export function CosmeticItemCard({
  avatar,
  coins,
  item,
  level,
  onBuy,
  onEquip,
  onUnequip,
}: CosmeticItemCardProps) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState(false);
  const state = getAvatarItemState(coins, level, item, avatar);
  const isLocked = state === "locked";
  const isDisabled = state === "locked" || state === "not-enough-coins";
  const previewAvatar =
    state === "equipped"
      ? getAvatarWithoutCategory(avatar, item.category)
      : getAvatarWithPreviewItem(avatar, item);
  const itemOnlyAvatar = getPreviewAvatarForItem(item);

  function runWithFeedback(action: () => void) {
    setFeedback(true);
    window.setTimeout(() => setFeedback(false), 260);
    action();
  }

  return (
    <article
      className={cn(
        "dashboard-card group relative overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1",
        feedback ? "avatar-action-pulse" : "",
        isLocked ? "opacity-75" : "",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "rounded-2xl bg-gradient-to-br p-1 shadow-sm",
            rarityAccentClasses[item.rarity],
          )}
        >
          <AvatarCanvas avatar={itemOnlyAvatar} size="xs" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                rarityClasses[item.rarity],
              )}
            >
              {t(getAvatarRarityLabelKey(item.rarity))}
            </span>
            <span className="section-muted text-xs font-semibold uppercase">
              {t(getAvatarCategoryLabelKey(item.category))}
            </span>
          </div>
          <h3 className="section-title mt-3 text-base font-semibold">
            {t(getAvatarItemNameKey(item.id))}
          </h3>
          <p className="section-muted mt-2 min-h-12 text-sm leading-6">
            {t(getAvatarItemDescriptionKey(item.id))}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="soft-card rounded-2xl p-2">
          <p className="section-muted px-1 pb-2 text-xs font-semibold uppercase">
            {t("shop.currentLook")}
          </p>
          <AvatarCanvas avatar={avatar} className="mx-auto" size="sm" />
        </div>
        <div className="soft-card rounded-2xl p-2">
          <p className="section-muted px-1 pb-2 text-xs font-semibold uppercase">
            {t("shop.previewLook")}
          </p>
          <AvatarCanvas avatar={previewAvatar} className="mx-auto" size="sm" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="accent-badge inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
          <Icon name="coins" className="h-3.5 w-3.5" />
          {t("shop.price", { price: item.price })}
        </span>
        {item.requiredLevel ? (
          <span className="soft-card rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
            {t("shop.requiredLevel", { level: item.requiredLevel })}
          </span>
        ) : null}
        {state === "equipped" ? (
          <span className="accent-badge rounded-full px-2.5 py-1 text-xs font-semibold">
            {t("shop.equipped")}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          className={cn(
            "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition",
            state === "buy" ? "primary-button hover:-translate-y-0.5" : "",
            state === "owned" ? "accent-button hover:-translate-y-0.5" : "",
            state === "equipped"
              ? "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--brand)]"
              : "",
            isDisabled
              ? "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"
              : "",
          )}
          disabled={isDisabled}
          onClick={() => {
            if (state === "buy") {
              runWithFeedback(() => onBuy(item));
              return;
            }

            if (state === "owned") {
              runWithFeedback(() => onEquip(item));
              return;
            }

            if (state === "equipped") {
              runWithFeedback(() => onUnequip(item.category));
            }
          }}
          type="button"
        >
          {state === "owned"
            ? t("shop.equip")
            : state === "equipped"
              ? t("shop.unequip")
              : t(stateCopy[state])}
        </button>
      </div>

      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/72 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <span className="dashboard-card rounded-xl px-3 py-2 text-sm font-semibold">
            {t("shop.requiredLevel", { level: item.requiredLevel ?? 1 })}
          </span>
        </div>
      ) : null}
    </article>
  );
}
