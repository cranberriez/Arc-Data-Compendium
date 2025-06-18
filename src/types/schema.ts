/**
 * Schema-derived types
 *
 * This file provides types that are derived directly from the database schema
 * using Drizzle's type inference capabilities.
 */

import { InferSelectModel } from "drizzle-orm";
import {
	items,
	weapons,
	weaponStats,
	upgrade,
	upgradeStats,
	Rarity,
	ItemCategory,
	AmmoType,
	WeaponClass,
	StatType,
	ModifierType,
	StatUsage,
} from "@/db/schema/items";
import { recipes, recipeItems } from "@/db/schema/recipes";
import { QuickUseData } from "./items/quickuse";
import { GearData } from "./items/gear";
import { WeaponModSlot } from "./items/weapon";

// Base schema-derived types
export type ItemModel = InferSelectModel<typeof items>;
export type WeaponModel = InferSelectModel<typeof weapons>;
export type WeaponStatsModel = InferSelectModel<typeof weaponStats>;
export type UpgradeModel = InferSelectModel<typeof upgrade>;
export type UpgradeStatsModel = InferSelectModel<typeof upgradeStats>;
export type RecipeModel = InferSelectModel<typeof recipes>;
export type RecipeItemModel = InferSelectModel<typeof recipeItems>;

// Enhanced types for joined data
export type RecipeIO = RecipeItemModel;

// Recipe with inputs and outputs
export type EnhancedRecipe = RecipeModel & {
	inputs: RecipeIO[];
	outputs: RecipeIO[];
};

// Enhanced item with related data
export type EnhancedItem = ItemModel & {
	weapon?: WeaponModel;
	weaponStats?: WeaponStatsModel;
	upgrades?: (UpgradeModel & { stats: UpgradeStatsModel[] })[];
	recycling?: RecipeIO[];
	recyclingSources?: EnhancedRecipe[];
	quickUse?: QuickUseData;
	gear?: GearData;
};

// Enhanced weapon (item that is a weapon)
export type EnhancedWeapon = EnhancedItem & {
	weapon: WeaponModel;
	weaponStats: WeaponStatsModel;
};

// Export enum types from the schema
export type { Rarity, ItemCategory, AmmoType, WeaponClass, StatType, ModifierType, StatUsage };

// Export JSON types that aren't directly in the schema
export type { QuickUseData, GearData, WeaponModSlot };
