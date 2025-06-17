import {
	items,
	weapons,
	weaponStats,
	upgrade,
	upgradeStats,
	requiredItem,
} from "@/db/schema/items";
import { recipes, recipeItems } from "@/db/schema/recipes";

// Base types and interfaces
export * from "./items/types";
export * from "./items/quickuse";
export * from "./items/gear";
export * from "./items/weapon";

export * from "./base";
export * from "./workbench";
export * from "./recipe";
export * from "./quest";

// Item Types
export type { BaseItem } from "./base";

// Required item is a global table for anything using an item, refer to consumerType for what it's used for
export type RequiredItem = typeof requiredItem.$inferSelect;

// a row from the junction table
export type RecipeRow = typeof recipeItems.$inferSelect;

// a recipe row plus its I/O arrays
export type Recipe = typeof recipes.$inferSelect & {
	inputs: RecipeRow[]; // role === "input"
	outputs: RecipeRow[]; // role === "output"
};

// export type { Item } from "./items/item";
// Override the `recycling` column (string FK) with a richer joined type
export type Item = typeof items.$inferSelect & {
	recycling: RecipeRow[];
};

export type WeaponStats = typeof weaponStats.$inferSelect;
export type UpgradeStats = typeof upgradeStats.$inferSelect;
export type Upgrade = typeof upgrade.$inferSelect & { stats: UpgradeStats[] };

export type BaseWeapon = Item & typeof weapons.$inferSelect;
export type Weapon = BaseWeapon & { weaponStats: WeaponStats; upgrades: Upgrade[] };

// Quickuse and Gear stats remain as JSON in database so their type stays
export type { QuickUseData, QuickUseStat, QuickUseCharge } from "./items/quickuse";
export type { GearData, GearStat } from "./items/gear";

// Item and Weapon Enums
export {
	rarityEnum as Rarity, // item rarity (common, uncommon, rare, epic, legendary)
	itemCategoryEnum as ItemCategory, // item category (weapon, quick use, etc.)
	ammoTypeEnum as AmmoType, // ammo type (light, medium, heavy, shotgun, energy)
	weaponClassEnum as WeaponClass, // weapon class (smg, assault rifle, etc.)
	statTypeEnum as StatType, // All weapon stats (including those adjusted by upgrades)
	modifierTypeEnum as ModifierType, // Weapon upgrade modification (additive / multiplicative)
	consumerTypeEnum as ConsumerType, // What a required item is used for (e.g. weapon upgrade, recipe, etc.)
} from "@/db/schema/items";

// Weapon Types
export type {
	// Weapon,
	// WeaponUpgrade,
	// WeaponStats,
	WeaponModSlot,
	// WeaponClass,
	// AmmoType,
} from "./items/weapon";

// Item Type Enums
export type {
	// Rarity,
	ItemSource,
	// ItemCategory,
	ItemSourceType,
	ShieldType,
	TraderName,
} from "./items/types";

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
