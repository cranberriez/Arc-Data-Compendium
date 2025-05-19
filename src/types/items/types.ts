// Re-export types from the documentation

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemSourceType = "drop" | "buy" | "quest" | "found" | "event" | "craft";

export type ItemCategory =
  | "recyclable"
  | "valuables"
  | "quick_use"
  | "ammunition"
  | "weapon"
  | "gear";

export type QuickUseCategory = "healing" | "throwable" | "utility";

export type ShieldType = "light" | "medium" | "heavy";

export type AmmoType = "light" | "medium" | "heavy" | "shotgun" | "energy";

export type ModSlotType = "muzzle" | "grip" | "magazine" | "stock" | "tech" | "sight";

export type WeaponType =
  | "shotgun"
  | "assault_rifle"
  | "pistol"
  | "submachine_gun"
  | "sniper_rifle"
  | "rifle"
  | "machine_gun";

export type TraderName = "Tian Wen" | "Lance" | "Apollo" | "Shani";

export interface ItemSource {
  type: ItemSourceType | "enemy" | "crafting";
  location: string;
  level?: string;
  chance?: number;
  questId?: string;
  enemyType?: string;
  value?: number;
  trader?: TraderName;
}

export interface RecipeRequirement {
  itemId: string;
  count: number;
}

export interface Recipe {
  id: string;
  outputItemId: string;
  requirements: RecipeRequirement[];
  workbench: "none" | "small" | "medium" | "large" | "weaponsmith" | "electronics" | "chemistry";
  workbenchTier: number;
  craftTime: number;
  outputCount: number;
  unlockedByDefault: boolean;
}
