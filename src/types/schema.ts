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
import { recipes, recipeItems, recipeLocks } from "@/db/schema/recipes";
import {
	quests,
	questLinks,
	questEntries,
	questEntryItems,
	QuestEntryType,
} from "@/db/schema/quest";
import { workbenches, tiers, tierRequirements, workbenchRecipes } from "@/db/schema/workbenches";
import { QuickUseData } from "./items/quickuse";
import { GearData } from "./items/gear";
import { WeaponModSlot } from "./items/weapon";

// Base schema-derived types
export type ItemBase = InferSelectModel<typeof items>;
export type WeaponBase = InferSelectModel<typeof weapons>;
export type WeaponStatsBase = InferSelectModel<typeof weaponStats>;
export type UpgradeBase = InferSelectModel<typeof upgrade>;
export type UpgradeStatsBase = InferSelectModel<typeof upgradeStats>;
export type RecipeBase = InferSelectModel<typeof recipes>;
export type RecipeItemBase = InferSelectModel<typeof recipeItems>;
export type RecipeLockBase = InferSelectModel<typeof recipeLocks>;

// Quest schema-derived types
export type QuestBase = InferSelectModel<typeof quests>;
export type QuestLinkBase = InferSelectModel<typeof questLinks>;
export type QuestEntryBase = InferSelectModel<typeof questEntries>;
export type QuestEntryItemBase = InferSelectModel<typeof questEntryItems>;

// Workbench schema-derived types
export type WorkbenchBase = InferSelectModel<typeof workbenches>;
export type TierBase = InferSelectModel<typeof tiers>;
export type TierRequirementBase = InferSelectModel<typeof tierRequirements>;
export type WorkbenchRecipeBase = InferSelectModel<typeof workbenchRecipes>;

// Recipe with inputs and outputs
export type Recipe = RecipeBase & {
	io: RecipeItemBase[];
	locks: RecipeLockBase | null;
};

// Item with related data
export type Item = ItemBase & {
	weapon?: WeaponBase & {
		stats?: WeaponStatsBase[];
		upgrades?: (UpgradeBase & { stats?: UpgradeStatsBase[] })[];
	};
	recycling?: Recipe;
	recyclingSources?: Recipe[];
};

// Weapon (item that is a weapon)
export type Weapon = Item;

// Quest entry with related items
export type QuestEntry = QuestEntryBase & {
	relatedItems?: (QuestEntryItemBase & { item?: ItemBase })[];
};

// Quest with entries, previous and next quests
export type Quest = QuestBase & {
	entries: QuestEntry[];
	previous: QuestBase["id"][]; // Array of previous quest ids
	next: QuestBase["id"][]; // Array of next quest ids
};

// Tier with requirements and recipes
export type Tier = TierBase & {
	requirements: (TierRequirementBase & { item: ItemBase })[];
	recipes?: (WorkbenchRecipeBase & { recipe: Recipe })[];
};

export type WorkbenchRecipe = WorkbenchRecipeBase & { recipe: Recipe };

// Workbench with tiers
export type Workbench = WorkbenchBase & {
	tiers: Tier[];
	workbenchRecipes: WorkbenchRecipe[];
};

// Export enum types from the schema
export type { Rarity, ItemCategory, AmmoType, WeaponClass, StatType, ModifierType, StatUsage };

// Export quest enum types
export type { QuestEntryType };

// Export JSON types that aren't directly in the schema
export type { QuickUseData, GearData, WeaponModSlot };
