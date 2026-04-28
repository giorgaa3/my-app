"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { useLanguage } from "@/hooks/use-language";
import {
  getLevelTitleKey,
} from "@/lib/i18n";
import { getLevelInfo } from "@/lib/lifequest";
import type {
  LifeQuestProfile,
  UserAvatar,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarPreviewProps = {
  avatar: UserAvatar;
  className?: string;
  compact?: boolean;
  profile?: LifeQuestProfile;
};

export function AvatarPreview({
  avatar,
  className,
  compact = false,
  profile,
}: AvatarPreviewProps) {
  const { t } = useLanguage();
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
    </section>
  );
}
