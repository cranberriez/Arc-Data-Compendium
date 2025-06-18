import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { baseItemColumns } from "./base";
import { relations } from "drizzle-orm";
import { requiredItem } from "./requiredItem";

export const workbenches = pgTable("workbenches", {
	...baseItemColumns,
	baseTier: integer("base_tier").notNull(),
});

export const workbenchesRelations = relations(workbenches, ({ many }) => ({
	tiers: many(tiers),
}));

export const tiers = pgTable("workbench_tiers", {
	workbenchId: varchar("workbench_id", { length: 255 })
		.references(() => workbenches.id)
		.notNull(),
	tier: integer("tier").notNull(),
	tierName: varchar("tier_name", { length: 255 }).notNull(),
	raidsRequired: integer("raids_required"),
});

export const tiersRelations = relations(tiers, ({ one, many }) => ({
	workbench: one(workbenches, { fields: [tiers.workbenchId], references: [workbenches.id] }),
	requiredItems: many(requiredItem),
}));
