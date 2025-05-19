// Re-export all item-related types and utilities

// Base types and interfaces
export * from "./items/types";
export * from "./items/base";

// Re-export commonly used types for convenience
export type { BaseItem } from "./items/base";

export type {
	Rarity,
	ItemSource,
	ItemCategory,
	Recipe,
	RecipeRequirement,
	ItemSourceType,
	QuickUseCategory,
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
