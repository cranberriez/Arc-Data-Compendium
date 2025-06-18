import { pgTable, varchar, integer, serial, unique, check, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { baseItemColumns } from "./base";
import { relations } from "drizzle-orm";
import { items } from "./index";

export const workbenches = pgTable("workbenches", {
	...baseItemColumns,
	baseTier: integer("base_tier").notNull(),
	raidsRequired: integer("raids_required"),
});

export const workbenchesRelations = relations(workbenches, ({ many }) => ({
	tiers: many(tiers),
}));

export const tiers = pgTable(
	"workbench_tiers",
	{
		id: serial("id").primaryKey(),
		workbenchId: varchar("workbench_id", { length: 255 })
			.references(() => workbenches.id, { onDelete: "cascade" })
			.notNull(),
		tier: integer("tier").notNull(),
		tierName: varchar("tier_name", { length: 255 }).notNull(),
	},
	(table) => [
		unique("unique_workbench_tier").on(table.workbenchId, table.tier),
		index("workbench_idx").on(table.workbenchId),
		index("tier_idx").on(table.tier),
	]
);

export const tiersRelations = relations(tiers, ({ one, many }) => ({
	workbench: one(workbenches, { fields: [tiers.workbenchId], references: [workbenches.id] }),
	requirements: many(tierRequirements),
}));

export const tierRequirements = pgTable(
	"tier_requirements",
	{
		tierId: integer("tier_id")
			.references(() => tiers.id, { onDelete: "cascade" })
			.notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id, { onDelete: "cascade" })
			.notNull(),
		count: integer("count").notNull(),
	},
	(table) => [
		// 1. Prevent duplicate requirements for a tier
		unique("unique_workbench_upgrade_item").on(table.tierId, table.itemId),
		// 2. Ensure count > 0
		check("count_positive", sql`${table.count} > 0`),
		// 4. Indexes for performance
		index("workbench_tier_idx").on(table.tierId),
		index("workbench_upgrade_item_idx").on(table.itemId),
	]
);

export const tierRequirementsRelations = relations(tierRequirements, ({ one }) => ({
	tier: one(tiers, { fields: [tierRequirements.tierId], references: [tiers.id] }),
	item: one(items, { fields: [tierRequirements.itemId], references: [items.id] }),
}));
