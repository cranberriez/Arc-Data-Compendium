// Re-export all item-related types and utilities

// Base types and interfaces
export * from "./items/types";
export * from "./items/base";
export * from "./items/workbench";
export * from "./items/recipe";
export * from "./items/quickuse";
export * from "./items/gear";

// Re-export commonly used types for convenience
export type { BaseItem } from "./items/base";
export type { Item } from "./items/item";
export type { Workbench, WorkbenchTier } from "./items/workbench";
export type { Recipe, RecipeRequirement } from "./items/recipe";
export type { QuickUseData, QuickUseStat, QuickUseCharge } from "./items/quickuse";
export type { GearData, GearStat } from "./items/gear";

export type {
	Rarity,
	ItemSource,
	ItemCategory,
	ItemSourceType,
	ShieldType,
	AmmoType,
	ModSlotType,
	WeaponType,
	TraderName,
} from "./items/types";

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = { [K in keyof T]-?: NonNullable<T[K]> };
