// workbenches.ts
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

// ---------------------------
// Item & Weapon Tables
// ---------------------------

// Enums matching our TS types
export const rarityEnum = pgEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]);

export const itemCategoryEnum = pgEnum("item_category", [
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
]);

// Base Item table (includes BaseItem & Item fields)
export const items = pgTable("items", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	description: text("description"),
	icon: varchar("icon", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
	rarity: rarityEnum("rarity"),
	value: integer("value"),
	weight: real("weight"),
	maxStack: integer("max_stack"),
	category: itemCategoryEnum("category"),
	flavorText: text("flavor_text"),
	recipeId: varchar("recipe_id", { length: 255 }),

	quickUse: jsonb("quick_use"),
	gear: jsonb("gear"),
});

// Weapon specific enums
export const ammoTypeEnum = pgEnum("ammo_type", ["light", "medium", "heavy", "shotgun", "energy"]);

export const weaponClassEnum = pgEnum("weapon_class", [
	"assault_rifle",
	"battle_rifle",
	"smg",
	"shotgun",
	"pistol",
	"light_machinegun",
	"sniper_rifle",
	"special",
]);

// Weapon extension table (1-to-1 with items)
export const weapons = pgTable("weapons", {
	itemId: varchar("item_id", { length: 255 })
		.primaryKey()
		.references(() => items.id),
	ammoType: ammoTypeEnum("ammo_type"),
	weaponClass: weaponClassEnum("weapon_class"),
	modSlots: jsonb("mod_slots"),
	compatibleMods: jsonb("compatible_mods"),
	baseTier: integer("base_tier"),
	maxLevel: integer("max_level"),
});

// Because we store base stats and modifier stats in the same table, we need to know which is which
export const statUsageEnum = pgEnum("stat_usage", ["base", "modifier"]);

export const weaponStats = pgTable("weapon_stats", {
	itemId: varchar("item_id", { length: 255 })
		.primaryKey()
		.references(() => items.id),
	statUsage: statUsageEnum("stat_usage"),
	damage: real("damage"),
	fireRate: real("fire_rate"),
	range: real("range"),
	stability: real("stability"),
	agility: real("agility"),
	stealth: real("stealth"),
	durabilityBurn: real("durability_burn"),
	magazineSize: real("magazine_size"),
});

// Stat types
export const statTypeEnum = pgEnum("stat_type", [
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
]);

// Modifier types
export const modifierTypeEnum = pgEnum("modifier_type", ["additive", "multiplicative"]);

// Upgrade table
export const upgrade = pgTable(
	"weapon_upgrade",
	{
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id)
			.notNull(),
		level: integer("level").notNull(),
		description: text("description"),
	},
	(table) => [primaryKey({ name: "id", columns: [table.itemId, table.level] })]
);

export const upgradeStats = pgTable(
	"weapon_upgrade_stats",
	{
		upgradeItemId: varchar("upgrade_item_id", { length: 255 }).notNull(),
		upgradeItemLevel: integer("upgrade_item_level").notNull(),
		statType: statTypeEnum("stat_type").notNull(),
		modifierType: modifierTypeEnum("modifier_type").notNull(),
		value: real("value").notNull(),
	},
	(table) => [
		foreignKey({
			name: "weapon_upgrade_id",
			columns: [table.upgradeItemId, table.upgradeItemLevel],
			foreignColumns: [upgrade.itemId, upgrade.level],
		}),
	]
);

// What a required item is used for (e.g. weapon upgrade, recipe, etc.), improves lookups
export const consumerTypeEnum = pgEnum("consumer_type", [
	"weapon_upgrade",
	"recycle",
	"workbench_upgrade",
	"recipe",
	"quest",
]);

// Many-to-Many table for required items for anything using an item
export const requiredItem = pgTable(
	"required_item",
	{
		id: serial("id").primaryKey(),
		consumerType: consumerTypeEnum("consumer_type").notNull(),
		consumerId: varchar("consumer_id", { length: 255 }).notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id)
			.notNull(),
		count: integer("count").notNull(),
	},
	(table) => [
		index("required_item_idx").on(table.itemId),
		index("item_consumer_idx").on(table.consumerType, table.consumerId),
	]
);
