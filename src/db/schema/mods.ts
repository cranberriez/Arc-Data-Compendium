import { relations } from "drizzle-orm";
import { pgTable, integer, real, varchar, serial, jsonb, foreignKey } from "drizzle-orm/pg-core";
import { items } from "./items";
import { ammoTypeEnum, weaponClassEnum, statUsageEnum } from "./enums";
import { WeaponModSlot } from "@/types";
import { upgrade } from "./upgrades";

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
