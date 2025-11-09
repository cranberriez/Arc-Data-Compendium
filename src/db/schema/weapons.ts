import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, serial, jsonb, text } from "drizzle-orm/pg-core";
import { items } from "./items";
import { ammoTypeEnum, weaponClassEnum } from "./enums";
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
  compatibleMods: text("compatible_mods").array().default([]).notNull(),
  // Base weapon stats stored as canonical JSON (keyed by normalized metric)
  statsBase: jsonb("stats_base"),
});

export const weaponsRelations = relations(weapons, ({ one, many }) => ({
  item: one(items, { fields: [weapons.itemId], references: [items.id] }),
  upgrades: many(upgrade),
}));
