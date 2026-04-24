"use client";

import { AvatarLayer } from "@/components/avatar/AvatarLayer";
import { AccessoryLayer } from "@/components/avatar/layers/AccessoryLayer";
import { BaseCharacterLayer } from "@/components/avatar/layers/BaseCharacterLayer";
import { FaceLayer } from "@/components/avatar/layers/FaceLayer";
import { HairLayer } from "@/components/avatar/layers/HairLayer";
import { PantsLayer } from "@/components/avatar/layers/PantsLayer";
import { ShoesLayer } from "@/components/avatar/layers/ShoesLayer";
import { TopLayer } from "@/components/avatar/layers/TopLayer";
import { avatarItems } from "@/data/avatar-items";
import { getEquippedItems } from "@/lib/avatar";
import {
  getAccessoryVariant,
  getAvatarCanvasStyle,
  getHairVariant,
  getPantsVariant,
  getShoesVariant,
  getTopVariant,
} from "@/lib/avatar-renderer";
import type { UserAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarCanvasProps = {
  avatar: UserAvatar;
  className?: string;
  size?: "lg" | "md" | "sm";
};

const canvasSizeClasses = {
  lg: "min-h-[430px] rounded-2xl p-6",
  md: "min-h-[340px] rounded-2xl p-5",
  sm: "h-36 w-28 rounded-2xl p-2",
} as const;

const figureSizeClasses = {
  lg: "w-[260px]",
  md: "w-[210px]",
  sm: "w-[88px]",
} as const;

export function AvatarCanvas({
  avatar,
  className,
  size = "lg",
}: AvatarCanvasProps) {
  const equippedItems = getEquippedItems(avatar, avatarItems);
  const canvasStyle = getAvatarCanvasStyle(equippedItems);
  const hairVariant = getHairVariant(equippedItems.hair?.id);
  const topVariant = getTopVariant(equippedItems.top?.id);
  const pantsVariant = getPantsVariant(equippedItems.pants?.id);
  const shoesVariant = getShoesVariant(equippedItems.shoes?.id);
  const accessoryVariant = getAccessoryVariant(equippedItems.accessory?.id);

  return (
    <div
      className={cn(
        "relative isolate flex overflow-hidden border transition duration-300",
        canvasSizeClasses[size],
        canvasStyle.backgroundClass,
        canvasStyle.frameClass,
        canvasStyle.themeClass,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_20%,rgb(255_255_255/0.5),transparent_12rem)]" />
      <div className="pointer-events-none absolute inset-x-6 bottom-5 h-12 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-white/30" />

      <div className="relative flex min-h-full w-full items-end justify-center">
        <div
          aria-label="Layered LifeQuest avatar"
          className={cn("relative aspect-[2/3]", figureSizeClasses[size])}
          role="img"
        >
          <AvatarLayer className="z-10" key="base-character">
            <BaseCharacterLayer />
          </AvatarLayer>
          <AvatarLayer className="z-20" key={`pants-${pantsVariant}`}>
            <PantsLayer variant={pantsVariant} />
          </AvatarLayer>
          <AvatarLayer className="z-30" key={`shoes-${shoesVariant}`}>
            <ShoesLayer variant={shoesVariant} />
          </AvatarLayer>
          <AvatarLayer className="z-40" key={`top-${topVariant}`}>
            <TopLayer variant={topVariant} />
          </AvatarLayer>
          <AvatarLayer className="z-50" key="face">
            <FaceLayer />
          </AvatarLayer>
          <AvatarLayer className="z-[60]" key={`hair-${hairVariant}`}>
            <HairLayer variant={hairVariant} />
          </AvatarLayer>
          <AvatarLayer className="z-[70]" key={`accessory-${accessoryVariant}`}>
            <AccessoryLayer variant={accessoryVariant} />
          </AvatarLayer>
        </div>
      </div>
    </div>
  );
}
