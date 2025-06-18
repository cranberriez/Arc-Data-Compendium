/**
 * Type exports
 *
 * This file re-exports types from schema.ts (schema-derived types)
 * as well as other necessary types from the application.
 *
 * IMPORTANT: Prefer using schema-derived types from schema.ts
 * instead of manually defined types whenever possible.
 */

// Schema-derived types
import {
	ItemModel,
	WeaponModel,
	WeaponStatsModel,
	UpgradeModel,
	UpgradeStatsModel,
	RecipeModel,
	RecipeIO,
	EnhancedItem,
	EnhancedWeapon,
	EnhancedRecipe,
	Rarity,
	ItemCategory,
	AmmoType,
	WeaponClass,
	StatType,
	ModifierType,
	StatUsage,
	QuickUseData,
	GearData,
	WeaponModSlot,
} from "./schema";

// Re-export schema-derived types
export type {
	ItemModel,
	WeaponModel,
	WeaponStatsModel,
	UpgradeModel,
	UpgradeStatsModel,
	RecipeModel,
	RecipeIO,
	EnhancedItem,
	EnhancedWeapon,
	EnhancedRecipe,
	QuickUseData,
	GearData,
	WeaponModSlot,
	Rarity,
	ItemCategory,
	AmmoType,
	WeaponClass,
	StatType,
	ModifierType,
	StatUsage,
};

// Legacy type aliases to maintain backward compatibility
// These will be deprecated in the future
export type RecipeRow = RecipeIO;
export type Recipe = EnhancedRecipe;
export type Item = EnhancedItem;
export type Weapon = EnhancedWeapon;
export type WeaponStats = WeaponStatsModel;
export type UpgradeStats = UpgradeStatsModel;
export type Upgrade = UpgradeModel & { stats: UpgradeStatsModel[] };

// Export types from other modules that are still needed
export * from "./items/types";
export * from "./base";
export * from "./workbench";
export * from "./recipe";
export * from "./quest";

// Workbench Types
export type {
	Workbench,
	WorkbenchTier,
	WorkbenchUpgradeSummary,
	WorkbenchUpgradeSummaryItem,
} from "./workbench";

// Recipe Types
// export type { Recipe, RecipeRequirement } from "./recipe";

// Quest Types
export type { QuestId, QuestObjective, QuestObjectiveLink, QuestReward, Quest } from "./quest";

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = { [K in keyof T]-?: NonNullable<T[K]> };
