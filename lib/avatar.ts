import type {
  AvatarItem,
  AvatarItemCategory,
  UserAvatar,
} from "@/lib/types";

export type AvatarItemState =
  | "buy"
  | "equipped"
  | "locked"
  | "not-enough-coins"
  | "owned";

export type AvatarPurchaseResult =
  | {
      avatar: UserAvatar;
      coins: number;
      ok: true;
    }
  | {
      ok: false;
      reason: Exclude<AvatarItemState, "buy">;
    };

export const avatarCategories: AvatarItemCategory[] = [
  "hair",
  "top",
  "pants",
  "shoes",
  "accessory",
  "background",
  "frame",
];

const legacyCategoryMap: Record<string, AvatarItemCategory> = {
  outfit: "top",
  theme: "background",
};

export const initialUserAvatar: UserAvatar = {
  equipped: {},
  ownedItemIds: [],
};

export function normalizeUserAvatar(value: unknown): UserAvatar {
  if (!value || typeof value !== "object") {
    return initialUserAvatar;
  }

  const storedAvatar = value as Partial<UserAvatar>;
  const ownedItemIds = Array.isArray(storedAvatar.ownedItemIds)
    ? storedAvatar.ownedItemIds.filter(
        (itemId): itemId is string => typeof itemId === "string",
      )
    : [];
  const equipped =
    storedAvatar.equipped && typeof storedAvatar.equipped === "object"
      ? Object.entries(storedAvatar.equipped).reduce<UserAvatar["equipped"]>(
          (nextEquipped, [rawCategory, itemId]) => {
            const category =
              legacyCategoryMap[rawCategory] ??
              (rawCategory as AvatarItemCategory);

            if (
              !avatarCategories.includes(category) ||
              typeof itemId !== "string"
            ) {
              return nextEquipped;
            }

            return {
              ...nextEquipped,
              [category]: itemId,
            };
          },
          {},
        )
      : {};

  return {
    equipped,
    ownedItemIds: Array.from(new Set(ownedItemIds)),
  };
}

export function canBuyItem(
  userCoins: number,
  userLevel: number,
  item: AvatarItem,
  ownedItemIds: string[],
): AvatarItemState {
  if (ownedItemIds.includes(item.id)) {
    return "owned";
  }

  if (item.requiredLevel && userLevel < item.requiredLevel) {
    return "locked";
  }

  if (userCoins < item.price) {
    return "not-enough-coins";
  }

  return "buy";
}

export function getAvatarItemState(
  userCoins: number,
  userLevel: number,
  item: AvatarItem,
  avatar: UserAvatar,
): AvatarItemState {
  if (avatar.equipped[item.category] === item.id) {
    return "equipped";
  }

  return canBuyItem(userCoins, userLevel, item, avatar.ownedItemIds);
}

export function buyAvatarItem(
  userCoins: number,
  userLevel: number,
  item: AvatarItem,
  avatar: UserAvatar,
): AvatarPurchaseResult {
  const state = canBuyItem(userCoins, userLevel, item, avatar.ownedItemIds);

  if (state !== "buy") {
    return {
      ok: false,
      reason: state,
    };
  }

  return {
    avatar: {
      ...avatar,
      ownedItemIds: [...avatar.ownedItemIds, item.id],
    },
    coins: userCoins - item.price,
    ok: true,
  };
}

export function equipAvatarItem(
  avatar: UserAvatar,
  item: AvatarItem,
): UserAvatar {
  if (!avatar.ownedItemIds.includes(item.id)) {
    return avatar;
  }

  return {
    ...avatar,
    equipped: {
      ...avatar.equipped,
      [item.category]: item.id,
    },
  };
}

export function unequipAvatarCategory(
  avatar: UserAvatar,
  category: AvatarItemCategory,
): UserAvatar {
  if (!avatar.equipped[category]) {
    return avatar;
  }

  const equipped = { ...avatar.equipped };
  delete equipped[category];

  return {
    ...avatar,
    equipped,
  };
}

export function getEquippedItems(
  avatar: UserAvatar,
  items: AvatarItem[],
): Partial<Record<AvatarItemCategory, AvatarItem>> {
  return avatarCategories.reduce<Partial<Record<AvatarItemCategory, AvatarItem>>>(
    (equippedItems, category) => {
      const itemId = avatar.equipped[category];

      if (!itemId) {
        return equippedItems;
      }

      const item = items.find(
        (currentItem) =>
          currentItem.id === itemId && currentItem.category === category,
      );

      if (!item) {
        return equippedItems;
      }

      return {
        ...equippedItems,
        [category]: item,
      };
    },
    {},
  );
}

export function getAvatarCompletionPercentage(avatar: UserAvatar) {
  const equippedCount = avatarCategories.filter(
    (category) => avatar.equipped[category],
  ).length;

  return Math.round((equippedCount / avatarCategories.length) * 100);
}
