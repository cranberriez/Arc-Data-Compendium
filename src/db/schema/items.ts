// workbenches.ts
import { relations } from "drizzle-orm";
import { pgTable, integer, text, jsonb, real, varchar } from "drizzle-orm/pg-core";
import { questEntryItems, tierRequirements } from "./index";
import { GearData, QuickUseData } from "@/types";
import { baseItemColumns } from "./base";
import { rarityEnum, itemCategoryEnum } from "./enums";
import { weapons } from "./weapons";
import { recipes } from "./recipes";

// ---------------------------
// Item & Weapon Tables
// ---------------------------

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
	foundIn: text("found_in").array().default([]),

	quickUse: jsonb("quick_use").$type<QuickUseData>(),
	gear: jsonb("gear").$type<GearData>(),

	// For items in category 'Modification': canonical modifiers JSON (object keyed by normalized metric)
	modifiers: jsonb("modifiers"),
	recyclingId: varchar("recycling_id", { length: 255 }).references(() => recipes.id),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
	weapon: one(weapons, { fields: [items.id], references: [weapons.itemId] }),

	// Quest many to many relationship table
	questEntries: many(questEntryItems),

	// Workbench requirements many relationship table
	workbenchRequirements: many(tierRequirements),

	recipe: one(recipes, { fields: [items.recipeId], references: [recipes.id] }),
	recycling: one(recipes, { fields: [items.recyclingId], references: [recipes.id] }),
}));
