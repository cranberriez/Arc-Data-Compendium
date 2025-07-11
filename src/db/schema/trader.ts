import { pgTable, serial, varchar, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./items";
import { quests } from "./quest";

// Traders table
export const traders = pgTable("traders", {
	id: varchar("id").primaryKey(), // lowercase trader name (e.g., 'celest', 'tian_wen')
	displayName: varchar("display_name").notNull(), // original capitalized name
	sellsDisplay: varchar("sells_display"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Trader shop junction table (many-to-many)
export const traderShop = pgTable(
	"trader_shop",
	{
		id: serial("id").primaryKey(),
		traderId: varchar("trader_id")
			.notNull()
			.references(() => traders.id),
		itemId: varchar("item_id")
			.notNull()
			.references(() => items.id),
		quantity: integer("quantity").notNull().default(1),
		price: integer("price").notNull(), // price in smallest currency unit
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		// Composite unique constraint - trader can't sell same item multiple times
		unique("trader_item_unique").on(table.traderId, table.itemId),
	]
);

// Relations for traders
export const tradersRelations = relations(traders, ({ many }) => ({
	quests: many(quests),
	shopItems: many(traderShop),
}));

// Relations for trader shop
export const traderShopRelations = relations(traderShop, ({ one }) => ({
	trader: one(traders, {
		fields: [traderShop.traderId],
		references: [traders.id],
	}),
	item: one(items, {
		fields: [traderShop.itemId],
		references: [items.id],
	}),
}));
