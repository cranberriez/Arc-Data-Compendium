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
	upgrade,
	versions,
	Rarity,
	ItemCategory,
	AmmoType,
	WeaponClass,
	StatType,
	ModifierType,
	StatUsage,
} from "@/db/schema";
import { recipes, recipeItems } from "@/db/schema/recipes";
import {
	quests,
	questLinks,
	questEntries,
	questEntryItems,
	QuestEntryType,
} from "@/db/schema/quest";
import { workbenches, tiers, tierRequirements, workbenchRecipes } from "@/db/schema/workbenches";
import { QuickUseData, QuickUseCharge, QuickUseStat } from "./items/quickuse";
import { GearData, GearStat } from "./items/gear";
import { WeaponModSlot } from "./items/weapon";

// Base schema-derived types
export type ItemBase = InferSelectModel<typeof items>;
export type WeaponBase = InferSelectModel<typeof weapons>;
export type UpgradeBase = InferSelectModel<typeof upgrade>;
export type RecipeBase = InferSelectModel<typeof recipes>;
export type RecipeItemBase = InferSelectModel<typeof recipeItems>;
export type VersionBase = InferSelectModel<typeof versions>;

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
};

// Modified recipe for recycling recipes
export type RecyclingRecipe = RecipeBase & {
	io: RecipeItemBase[];
};

export type ItemQuestEntry = QuestEntryItemBase & {
	questEntry: {
		type: QuestEntryType;
	};
};

// Item with related data
export type Item = ItemBase & {
	weapon?: WeaponBase & {
		upgrades?: UpgradeBase[];
	};
	recipe?: Recipe | null;
	recycling?: RecyclingRecipe | null;
	recyclingSources?: Recipe[];
	questEntries?: ItemQuestEntry[];
	workbenchRequirements?: TierRequirementBase[];
	version?: VersionBase;
};

// Weapon (item that is a weapon)
export type Weapon = Item & {
	weapon: WeaponBase;
};

export type QuestEntryItem = QuestEntryItemBase & {
	item?: ItemBase;
};

// Quest entry with related items
export type QuestEntry = QuestEntryBase & {
	items?: QuestEntryItem[];
};

// Quest with entries, previous and next quests
export type Quest = QuestBase & {
	entries: QuestEntry[];
	previous: QuestBase["id"][]; // Array of previous quest ids
	next: QuestBase["id"][]; // Array of next quest ids
	version?: VersionBase;
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
export type { QuickUseData, QuickUseCharge, QuickUseStat, GearData, GearStat, WeaponModSlot };
