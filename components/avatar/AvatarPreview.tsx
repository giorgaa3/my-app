"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { avatarItems } from "@/data/avatar-items";
import { useLanguage } from "@/hooks/use-language";
import { avatarCategories, getEquippedItems } from "@/lib/avatar";
import {
  getAvatarCategoryLabelKey,
  getAvatarItemNameKey,
  getLevelTitleKey,
} from "@/lib/i18n";
import { getLevelInfo } from "@/lib/lifequest";
import type {
  AvatarItemCategory,
  LifeQuestProfile,
  UserAvatar,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarPreviewProps = {
  avatar: UserAvatar;
  className?: string;
  compact?: boolean;
  onUnequip?: (category: AvatarItemCategory) => void;
  profile?: LifeQuestProfile;
};

export function AvatarPreview({
  avatar,
  className,
  compact = false,
  onUnequip,
  profile,
}: AvatarPreviewProps) {
  const { t } = useLanguage();
  const equippedItems = getEquippedItems(avatar, avatarItems);
  const levelInfo = profile ? getLevelInfo(profile.xp) : null;

  return (
    <section className={cn("dashboard-card rounded-2xl p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-muted text-sm font-semibold uppercase">
            {t("avatar.previewTitle")}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold">
            {profile
              ? `${t("common.level")} ${levelInfo?.level}`
              : t("profile.customizeTitle")}
          </h2>
          {profile && levelInfo ? (
            <p className="section-muted mt-1 text-sm font-semibold">
              {t(getLevelTitleKey(levelInfo.title))}
            </p>
          ) : null}
        </div>
        {profile ? (
          <div className="accent-badge rounded-xl px-3 py-2 text-sm font-semibold">
            {profile.coins} {t("common.coins")}
          </div>
        ) : null}
      </div>

      <AvatarCanvas
        avatar={avatar}
        className="mt-5"
        size={compact ? "md" : "lg"}
      />

      <p className="section-muted mt-4 text-sm leading-6">
        {t("avatar.previewDescription")}
      </p>

      {!compact ? (
        <div className="mt-5">
          <p className="section-title text-sm font-semibold">
            {t("avatar.equippedLoadout")}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {avatarCategories.map((category) => {
              const item = equippedItems[category];

              return (
                <div
                  className="soft-card flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                  key={category}
                >
                  <span className="min-w-0">
                    <span className="section-muted block text-xs font-semibold uppercase">
                      {t(getAvatarCategoryLabelKey(category))}
                    </span>
                    <span className="section-title mt-1 block truncate text-sm font-semibold">
                      {item
                        ? t(getAvatarItemNameKey(item.id))
                        : t("avatar.slotEmpty")}
                    </span>
                  </span>
                  {item && onUnequip ? (
                    <button
                      className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--foreground)]"
                      onClick={() => onUnequip(category)}
                      type="button"
                    >
                      {t("shop.unequip")}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
