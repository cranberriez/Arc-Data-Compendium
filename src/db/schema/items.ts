// workbenches.ts
import { relations } from "drizzle-orm";
import {
	pgTable,
	varchar,
	integer,
	serial,
	text,
	timestamp,
	pgEnum,
	jsonb,
	index,
	foreignKey,
	real,
	primaryKey,
	unique,
} from "drizzle-orm/pg-core";
import { recipes, questEntryItems, tierRequirements } from "./index";
import { GearData, QuickUseData, WeaponModSlot } from "@/types";
import { baseItemColumns } from "./base";

// ---------------------------
// Item & Weapon Tables
// ---------------------------

// Enums matching our TS types
const rarityValues = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type Rarity = (typeof rarityValues)[number];
export const rarityEnum = pgEnum("rarity", rarityValues);

const itemCategoryValues = [
	"recyclable",
	"trinket",
	"quick_use",
	"ammo",
	"weapon",
	"gear",
	"misc",
	"topside_material",
	"refined_material",
	"key",
] as const;
export type ItemCategory = (typeof itemCategoryValues)[number];
export const itemCategoryEnum = pgEnum("item_category", itemCategoryValues);

// Weapon specific enums
const ammoTypeValues = ["light", "medium", "heavy", "shotgun", "energy"] as const;
export const ammoTypeEnum = pgEnum("ammo_type", ammoTypeValues);
export type AmmoType = (typeof ammoTypeValues)[number];

const weaponClassValues = [
	"assault_rifle",
	"battle_rifle",
	"smg",
	"shotgun",
	"pistol",
	"light_machinegun",
	"sniper_rifle",
	"special",
] as const;
export const weaponClassEnum = pgEnum("weapon_class", weaponClassValues);
export type WeaponClass = (typeof weaponClassValues)[number];

// Because we store base stats and modifier stats in the same table, we need to know which is which
const statUsageValues = ["base", "modifier"] as const;
export const statUsageEnum = pgEnum("stat_usage", statUsageValues);
export type StatUsage = (typeof statUsageValues)[number];

// Stat types
const statTypeValues = [
	"damage",
	"fire_rate",
	"range",
	"stability",
	"agility",
	"stealth",
	"durability_burn",
	"magazine_size",
	"bullet_velocity",
	"reload_time",
	"recoil_horizontal",
	"recoil_vertical",
] as const;
export const statTypeEnum = pgEnum("stat_type", statTypeValues);
export type StatType = (typeof statTypeValues)[number];

// Modifier types
const modifierTypeValues = ["additive", "multiplicative"] as const;
export const modifierTypeEnum = pgEnum("modifier_type", modifierTypeValues);
export type ModifierType = (typeof modifierTypeValues)[number];

// Base Item table (includes BaseItem & Item fields)
export const items = pgTable("items", {
	...baseItemColumns,
	rarity: rarityEnum("rarity").notNull(),
	value: integer("value").notNull(),
	weight: real("weight").notNull(),
	maxStack: integer("max_stack").notNull(),
	category: itemCategoryEnum("category").notNull(),
	flavorText: text("flavor_text"),
	recipeId: varchar("recipe_id", { length: 255 }).references(() => recipes.id),

	quickUse: jsonb("quick_use").$type<QuickUseData>(),
	gear: jsonb("gear").$type<GearData>(),

	recyclingId: varchar("recycling_id", { length: 255 }).references(() => recipes.id),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
	weapon: one(weapons, { fields: [items.id], references: [weapons.itemId] }),

	// Quest many to many relationship table
	questEntries: many(questEntryItems),

	// Workbench requirements many relationship table
	workbenchRequirements: many(tierRequirements),
}));

// Weapon extension table (1-to-1 with items)
export const weapons = pgTable("weapons", {
	id: serial("id").primaryKey(),
	itemId: varchar("item_id", { length: 255 })
		.notNull()
		.unique()
		.references(() => items.id),
	ammoType: ammoTypeEnum("ammo_type"),
	weaponClass: weaponClassEnum("weapon_class"),
	modSlots: jsonb("mod_slots").$type<WeaponModSlot[]>().notNull(),
	compatibleMods: jsonb("compatible_mods").$type<string[]>().notNull(),
	baseTier: integer("base_tier"),
	maxLevel: integer("max_level"),
});

export const weaponsRelations = relations(weapons, ({ one, many }) => ({
	item: one(items, { fields: [weapons.itemId], references: [items.id] }),
	weaponStats: one(weaponStats, { fields: [weapons.id], references: [weaponStats.weaponId] }),
	upgrades: many(upgrade),
}));

export const weaponStats = pgTable(
	"weapon_stats",
	{
		weaponId: integer("weapon_id")
			.notNull()
			.references(() => weapons.id)
			.unique(),
		statUsage: statUsageEnum("stat_usage"),
		damage: real("damage"),
		fireRate: real("fire_rate"),
		range: real("range"),
		stability: real("stability"),
		agility: real("agility"),
		stealth: real("stealth"),
		durabilityBurn: real("durability_burn"),
		magazineSize: real("magazine_size"),
		bulletVelocity: real("bullet_velocity"),
		reloadTime: real("reload_time"),
		recoilHorizontal: real("recoil_horizontal"),
		recoilVertical: real("recoil_vertical"),
	},
	(table) => [foreignKey({ columns: [table.weaponId], foreignColumns: [weapons.id] })]
);

export const weaponStatsRelations = relations(weaponStats, ({ one }) => ({
	weapon: one(weapons, { fields: [weaponStats.weaponId], references: [weapons.id] }),
}));

// Upgrade table
export const upgrade = pgTable(
	"weapon_upgrade",
	{
		id: serial("id").primaryKey(),
		weaponId: integer("weapon_id")
			.notNull()
			.references(() => weapons.id),
		level: integer("level").notNull(),
		description: text("description"),
	},
	(table) => [
		foreignKey({ columns: [table.weaponId], foreignColumns: [weapons.id] }),
		unique("unique_weapon_upgrade").on(table.weaponId, table.level),
	]
);

export const upgradeRelations = relations(upgrade, ({ one, many }) => ({
	weapon: one(weapons, { fields: [upgrade.weaponId], references: [weapons.id] }),
	upgradeStats: many(upgradeStats),
}));

export const upgradeStats = pgTable(
	"weapon_upgrade_stats",
	{
		upgradeId: integer("upgrade_id")
			.notNull()
			.references(() => upgrade.id),
		statType: statTypeEnum("stat_type").notNull(),
		modifierType: modifierTypeEnum("modifier_type").notNull(),
		value: real("value").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.upgradeId],
			foreignColumns: [upgrade.id],
		}),
		primaryKey({
			columns: [table.upgradeId, table.statType],
		}),
	]
);

export const upgradeStatsRelations = relations(upgradeStats, ({ one }) => ({
	upgrade: one(upgrade, { fields: [upgradeStats.upgradeId], references: [upgrade.id] }),
}));
