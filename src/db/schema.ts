// workbenches.ts
import { pgTable, varchar, integer, serial, text, timestamp } from "drizzle-orm/pg-core";

export const workbenches = pgTable("workbenches", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	description: text("description"),
	icon: varchar("icon", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
	type: varchar("type", { length: 32 }),
	baseTier: integer("base_tier"),
});

export const workbenchTiers = pgTable("workbench_tiers", {
	id: serial("id").primaryKey(),
	workbenchId: varchar("workbench_id", { length: 255 }).references(() => workbenches.id),
	tier: integer("tier"),
	tierName: varchar("tier_name", { length: 255 }),
	raidsRequired: integer("raids_required"),
});

export const workbenchTierRequiredItems = pgTable("workbench_tier_required_items", {
	id: serial("id").primaryKey(),
	workbenchTierId: integer("workbench_tier_id").references(() => workbenchTiers.id),
	itemId: varchar("item_id", { length: 255 }), //.references(() => items.id),
	count: integer("count"),
});
