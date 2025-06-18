import {
	pgTable,
	varchar,
	integer,
	serial,
	unique,
	check,
	index,
	primaryKey,
	foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { baseItemColumns } from "./base";
import { relations } from "drizzle-orm";
import { items, recipes } from "./index";

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
		// id: serial("id").primaryKey(),
		workbenchId: varchar("workbench_id", { length: 255 })
			.references(() => workbenches.id, { onDelete: "cascade" })
			.notNull(),
		tier: integer("tier").notNull(),
		tierName: varchar("tier_name", { length: 255 }).notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.workbenchId, table.tier], name: "pk_tiers_workbenchid_tier" }),
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
	"workbench_tier_requirements",
	{
		// wbId and wbTier are used to construct composite foreign key, DO NOT use references in this case
		workbenchId: varchar("workbench_id", { length: 255 }).notNull(),
		workbenchTier: integer("workbench_tier").notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id, { onDelete: "cascade" })
			.notNull(),
		count: integer("count").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.workbenchId, table.workbenchTier],
			foreignColumns: [tiers.workbenchId, tiers.tier],
			name: "fk_tierreqs_workbenchid_tier",
		}),
		// 1. Prevent duplicate requirements for a tier
		unique("unique_workbench_upgrade_item").on(
			table.workbenchId,
			table.workbenchTier,
			table.itemId
		),
		// 2. Ensure count > 0
		check("count_positive", sql`${table.count} > 0`),
		// 4. Indexes for performance
		index("workbench_tier_idx").on(table.workbenchTier),
		index("workbench_upgrade_item_idx").on(table.itemId),
	]
);

export const tierRequirementsRelations = relations(tierRequirements, ({ one }) => ({
	tier: one(tiers, { fields: [tierRequirements.workbenchTier], references: [tiers.tier] }),
	item: one(items, { fields: [tierRequirements.itemId], references: [items.id] }),
}));

export const workbenchRecipes = pgTable(
	"workbench_recipes",
	{
		workbenchId: varchar("workbench_id", { length: 255 }).notNull(),
		workbenchTier: integer("workbench_tier").notNull(),
		recipeId: varchar("recipe_id", { length: 255 })
			.references(() => recipes.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.workbenchId, table.workbenchTier],
			foreignColumns: [tiers.workbenchId, tiers.tier],
			name: "fk_wbrecipes_workbenchid_tier",
		}),
		unique("unique_workbench_recipe").on(
			table.workbenchId,
			table.workbenchTier,
			table.recipeId
		),
		index("wbrecipes_workbench_idx").on(table.workbenchId),
		index("wbrecipes_tier_idx").on(table.workbenchTier),
		index("wbrecipes_recipe_idx").on(table.recipeId),
	]
);

export const workbenchRecipesRelations = relations(workbenchRecipes, ({ one }) => ({
	workbench: one(workbenches, {
		fields: [workbenchRecipes.workbenchId],
		references: [workbenches.id],
	}),
	tier: one(tiers, {
		fields: [workbenchRecipes.workbenchTier],
		references: [tiers.tier],
	}),
	recipe: one(recipes, { fields: [workbenchRecipes.recipeId], references: [recipes.id] }),
}));
