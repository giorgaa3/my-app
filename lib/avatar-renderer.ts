import type {
  AvatarItem,
  AvatarItemCategory,
  AvatarRarity,
  UserAvatar,
} from "@/lib/types";

export type EquippedAvatarItems = Partial<
  Record<AvatarItemCategory, AvatarItem>
>;

export type HairVariant = "classic-cap" | "cyber-hair" | "starter";
export type TopVariant =
  | "developer-hoodie"
  | "focus-armor"
  | "space-suit"
  | "starter";
export type PantsVariant =
  | "focus-trousers"
  | "lunar-pants"
  | "starter"
  | "utility-joggers";
export type ShoesVariant =
  | "focus-boots"
  | "rocket-runners"
  | "starter"
  | "starter-sneakers";
export type AccessoryVariant =
  | "crown"
  | "headphones"
  | "shadow-shades"
  | "none";

type AvatarCanvasStyle = {
  backgroundClass: string;
  frameClass: string;
  themeClass: string;
};

const backgroundClasses: Record<string, string> = {
  "morning-field-background":
    "bg-[radial-gradient(circle_at_24%_18%,rgb(254_243_199/0.82),transparent_13rem),linear-gradient(135deg,#dcfce7,#bfdbfe_52%,#fef3c7)]",
  "night-city-background":
    "bg-[radial-gradient(circle_at_72%_18%,rgb(167_139_250/0.45),transparent_14rem),linear-gradient(135deg,#0f172a,#312e81_58%,#111827)]",
  "calm-growth-theme":
    "bg-[radial-gradient(circle_at_24%_18%,rgb(187_247_208/0.72),transparent_14rem),linear-gradient(135deg,#ecfdf5,#ccfbf1_50%,#dbeafe)]",
  "royal-productivity-theme":
    "bg-[radial-gradient(circle_at_72%_18%,rgb(251_191_36/0.36),transparent_13rem),linear-gradient(135deg,#1e1b4b,#4c1d95_52%,#111827)]",
};

const frameClasses: Record<string, string> = {
  "glass-frame":
    "border-sky-300/70 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28),0_24px_70px_rgb(14_165_233/0.22)]",
  "golden-frame":
    "border-amber-300/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.32),0_24px_70px_rgb(245_158_11/0.28)]",
};

export const rarityAccentClasses: Record<AvatarRarity, string> = {
  common: "from-slate-100 to-slate-200 text-slate-700",
  epic: "from-violet-100 to-fuchsia-100 text-violet-700",
  legendary: "from-amber-100 to-yellow-100 text-amber-800",
  rare: "from-sky-100 to-cyan-100 text-sky-700",
};

export function getAvatarCanvasStyle(
  equippedItems: EquippedAvatarItems,
): AvatarCanvasStyle {
  const background = equippedItems.background?.id;
  const frame = equippedItems.frame?.id;

  return {
    backgroundClass:
      backgroundClasses[background ?? ""] ??
      "bg-[radial-gradient(circle_at_68%_16%,rgb(255_255_255/0.72),transparent_14rem),linear-gradient(135deg,#eff6ff,#f5f3ff_50%,#ecfdf5)]",
    frameClass:
      frameClasses[frame ?? ""] ??
      "border-white/45 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.24),0_22px_60px_rgb(15_23_42/0.12)]",
    themeClass:
      background === "calm-growth-theme"
        ? "ring-4 ring-emerald-300/20 shadow-[0_28px_80px_rgb(16_185_129/0.18)]"
        : background === "royal-productivity-theme"
          ? "ring-4 ring-violet-300/25 shadow-[0_28px_90px_rgb(124_58_237/0.3)]"
          : "",
  };
}

export function getHairVariant(itemId?: string): HairVariant {
  if (itemId === "classic-cap" || itemId === "cyber-hair") {
    return itemId;
  }

  return "starter";
}

export function getTopVariant(itemId?: string): TopVariant {
  if (
    itemId === "developer-hoodie" ||
    itemId === "focus-armor" ||
    itemId === "space-suit"
  ) {
    return itemId;
  }

  return "starter";
}

export function getPantsVariant(itemId?: string): PantsVariant {
  if (
    itemId === "focus-trousers" ||
    itemId === "lunar-pants" ||
    itemId === "utility-joggers"
  ) {
    return itemId;
  }

  return "starter";
}

export function getShoesVariant(itemId?: string): ShoesVariant {
  if (
    itemId === "focus-boots" ||
    itemId === "rocket-runners" ||
    itemId === "starter-sneakers"
  ) {
    return itemId;
  }

  return "starter";
}

export function getAccessoryVariant(itemId?: string): AccessoryVariant {
  if (
    itemId === "crown" ||
    itemId === "headphones" ||
    itemId === "shadow-shades"
  ) {
    return itemId;
  }

  return "none";
}

export function getPreviewAvatarForItem(item: AvatarItem): UserAvatar {
  return {
    equipped: {
      [item.category]: item.id,
    },
    ownedItemIds: [item.id],
  };
}

export function getAvatarWithPreviewItem(
  avatar: UserAvatar,
  item: AvatarItem,
): UserAvatar {
  return {
    ...avatar,
    equipped: {
      ...avatar.equipped,
      [item.category]: item.id,
    },
    ownedItemIds: avatar.ownedItemIds.includes(item.id)
      ? avatar.ownedItemIds
      : [...avatar.ownedItemIds, item.id],
  };
}
