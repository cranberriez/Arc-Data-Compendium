import {
	pgEnum,
	pgTable,
	real,
	timestamp,
	varchar,
	primaryKey,
	integer,
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
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
	io: many(recipeItems),
}));

export const ioEnum = pgEnum("recipe_io_role", ["input", "output"]);

export const recipeItems = pgTable(
	"recipe_items",
	{
		recipeId: varchar("recipe_id", { length: 255 })
			.references(() => recipes.id)
			.notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id)
			.notNull(),
		role: ioEnum("role").notNull(), // “input” or “output”
		qty: real("qty").default(1),
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
