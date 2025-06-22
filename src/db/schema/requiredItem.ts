import { pgEnum, pgTable, varchar, integer, index, primaryKey } from "drizzle-orm/pg-core";
import { items } from "./items";
import { relations } from "drizzle-orm";

// What a required item is used for (e.g. weapon upgrade, recipe, etc.), improves lookups
const consumerTypeValues = [
	"weapon_upgrade",
	"recycle",
	"workbench_upgrade",
	"recipe",
	"quest",
] as const;
export type ConsumerType = (typeof consumerTypeValues)[number];
export const consumerTypeEnum = pgEnum("consumer_type", consumerTypeValues);

// Many-to-Many table for required items for anything using an item
export const requiredItem = pgTable(
	"required_item",
	{
		consumerType: consumerTypeEnum("consumer_type").notNull(),
		consumerId: varchar("consumer_id", { length: 255 }).notNull(), // what is consuming the item, for recycling refers to the item being recycled
		itemId: varchar("item_id", { length: 255 }) // what the output item or required item is
			.references(() => items.id)
			.notNull(),
		count: integer("count").notNull(), // the number required or produced
	},
	(table) => [
		index("required_item_idx").on(table.itemId),
		index("item_consumer_idx").on(table.consumerType, table.consumerId),
		primaryKey({ columns: [table.itemId, table.consumerType, table.consumerId] }),
	]
);

export const requiredItemRelations = relations(requiredItem, ({ one }) => ({
	item: one(items, {
		fields: [requiredItem.itemId],
		references: [items.id],
	}),
}));
