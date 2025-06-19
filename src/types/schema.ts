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
import {
	quests,
	questLinks,
	questEntries,
	questEntryItems,
	questEntryType,
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

// Types for joined data
export type RecipeIO = RecipeItemBase;

// Recipe with inputs and outputs
export type Recipe = RecipeBase & {
	inputs: RecipeIO[];
	outputs: RecipeIO[];
};

// Item with related data
export type Item = ItemBase & {
	weapon?: WeaponBase;
	weaponStats?: WeaponStatsBase;
	upgrades?: (UpgradeBase & { stats: UpgradeStatsBase[] })[];
	recycling?: RecipeIO[];
	recyclingSources?: Recipe[];
	quickUse: QuickUseData | null;
	gear: GearData | null;
};

// Weapon (item that is a weapon)
export type Weapon = Item & {
	weapon: WeaponBase;
	weaponStats: WeaponStatsBase;
};

// Quest entry with related items
export type QuestEntry = QuestEntryBase & {
	items: (QuestEntryItemBase & { item: ItemBase })[];
};

// Quest with entries, previous and next quests
export type Quest = QuestBase & {
	entries: QuestEntry[];
	previous: (QuestLinkBase & { previous: QuestBase })[];
	next: (QuestLinkBase & { next: QuestBase })[];
};

// Tier with requirements and recipes
export type Tier = TierBase & {
	requirements: (TierRequirementBase & { item: ItemBase })[];
	recipes?: (WorkbenchRecipeBase & { recipe: RecipeBase })[];
};

// Workbench with tiers
export type Workbench = WorkbenchBase & {
	tiers: Tier[];
};

// Export enum types from the schema
export type { Rarity, ItemCategory, AmmoType, WeaponClass, StatType, ModifierType, StatUsage };

// Export quest enum types
export type { QuestEntryType };

// Export JSON types that aren't directly in the schema
export type { QuickUseData, GearData, WeaponModSlot };
