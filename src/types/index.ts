// Re-export all item-related types and utilities

// Base types and interfaces
export * from "./items/types";
export * from "./base";
export * from "./workbench";
export * from "./recipe";
export * from "./items/quickuse";
export * from "./items/gear";
export * from "./quest";
export * from "./items/weapon";

// Re-export commonly used types for convenience
export type { BaseItem } from "./base";
export type { Item } from "./items/item";
export type {
	Workbench,
	WorkbenchTier,
	WorkbenchUpgradeSummary,
	WorkbenchUpgradeSummaryItem,
} from "./workbench";
export type { Recipe, RecipeRequirement } from "./recipe";
export type { QuickUseData, QuickUseStat, QuickUseCharge } from "./items/quickuse";
export type { GearData, GearStat } from "./items/gear";
export type { QuestId, QuestObjective, QuestObjectiveLink, QuestReward, Quest } from "./quest";
export type {
	Weapon,
	WeaponUpgrade,
	WeaponStats,
	WeaponModSlot,
	WeaponClass,
	AmmoType,
} from "./items/weapon";

export type {
	Rarity,
	ItemSource,
	ItemCategory,
	ItemSourceType,
	ShieldType,
	TraderName,
} from "./items/types";

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = { [K in keyof T]-?: NonNullable<T[K]> };
