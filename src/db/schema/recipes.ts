import {
	pgEnum,
	pgTable,
	real,
	timestamp,
	varchar,
	primaryKey,
	integer,
	boolean,
	serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./items";

export const recipeTypeEnum = pgEnum("recipe_type", [
	"crafting",
	"recycling",
	// add more later
]);

export const recipes = pgTable("recipes", {
	id: varchar("id", { length: 255 }).primaryKey(), // in the format "recipe_<outputItemId>" or for recycling "recycle_<inputItemId>"
	type: recipeTypeEnum("type").notNull(),
	hasRecipeItem: boolean("has_recipe_item").notNull().default(false),
	inRaid: boolean("in_raid").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
	item: one(items, {
		fields: [recipes.id],
		references: [items.id],
	}),
	io: many(recipeItems),
	locks: one(recipeLocks, {
		fields: [recipes.id],
		references: [recipeLocks.recipeId],
	}),
}));

export const ioEnum = pgEnum("recipe_io_role", ["input", "output"]);

export const recipeItems = pgTable(
	"recipe_items",
	{
		recipeId: varchar("recipe_id", { length: 255 })
			.references(() => recipes.id, { onDelete: "cascade" })
			.notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id, { onDelete: "cascade" })
			.notNull(),
		role: ioEnum("role").notNull(), // “input” or “output”
		qty: real("qty").default(1).notNull(),
	},
	(t) => [primaryKey({ columns: [t.recipeId, t.itemId, t.role] })]
);

export const recipeItemsRelations = relations(recipeItems, ({ one }) => ({
	recipe: one(recipes, {
		fields: [recipeItems.recipeId],
		references: [recipes.id],
	}),
	item: one(items, {
		fields: [recipeItems.itemId],
		references: [items.id],
	}),
}));

export const recipeLocks = pgTable("recipe_locks", {
	recipeId: varchar("recipe_id", { length: 255 })
		.references(() => recipes.id, { onDelete: "cascade" })
		.unique()
		.notNull(),
	looted: boolean("looted").default(false),
	mastery: varchar("mastery", { length: 255 }),
	quest: varchar("quest", { length: 255 }),
	battlepass: varchar("battlepass", { length: 255 }),
	skill: varchar("skill", { length: 255 }),
	event: varchar("event", { length: 255 }),
	other: varchar("other", { length: 255 }),
});

export const recipeLocksRelations = relations(recipeLocks, ({ one }) => ({
	recipes: one(recipes, {
		fields: [recipeLocks.recipeId],
		references: [recipes.id],
	}),
}));
