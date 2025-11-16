import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, serial, jsonb, text } from "drizzle-orm/pg-core";
import { items } from "./items";
import { ammoTypeEnum, weaponClassEnum } from "./enums";
import { WeaponModSlot } from "@/types";
import { upgrade } from "./upgrades";
import { WeaponBaseStats } from "@/types/items/weapon";
import { versions } from "./versions";

// Weapon extension table (1-to-1 with items)
export const weapons = pgTable("weapons", {
	id: serial("id").primaryKey(),
	itemId: varchar("item_id", { length: 255 })
		.notNull()
		.unique()
		.references(() => items.id),
	versionId: integer("version_id").references(() => versions.id),
	ammoType: ammoTypeEnum("ammo_type"),
	weaponClass: weaponClassEnum("weapon_class"),
	modSlots: jsonb("mod_slots").$type<WeaponModSlot[]>().notNull(),
	compatibleMods: text("compatible_mods").array().default([]).notNull(),
	// Base weapon stats stored as canonical JSON (keyed by normalized metric)
	statsBase: jsonb("stats_base").$type<WeaponBaseStats>(),
});

export const weaponsRelations = relations(weapons, ({ one, many }) => ({
	item: one(items, { fields: [weapons.itemId], references: [items.id] }),
	upgrades: many(upgrade),
	version: one(versions, { fields: [weapons.versionId], references: [versions.id] }),
}));
