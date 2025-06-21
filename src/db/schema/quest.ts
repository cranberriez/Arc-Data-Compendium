import {
	pgTable,
	pgEnum,
	integer,
	check,
	pgView,
	varchar,
	text,
	serial,
	unique,
	index,
} from "drizzle-orm/pg-core";
import { createdUpdatedColumns } from "./base";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";

export const quests = pgTable("quests", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	trader: varchar("trader", { length: 255 }).notNull(),

	dialog: text("dialog").default(""),
	location: varchar("location", { length: 255 }), // expand later with locations (aka map)
	link: text("link"),
	xpReward: integer("xp_reward"),
	...createdUpdatedColumns,
});

export const questRelations = relations(quests, ({ one, many }) => ({
	entries: many(questEntries),
	previous: many(questLinks, { relationName: "previous" }),
	next: many(questLinks, { relationName: "next" }),
}));

export const questLinks = pgTable(
	"quest_links",
	{
		previous: varchar("previous", { length: 255 })
			.references(() => quests.id, { onDelete: "cascade" })
			.notNull(),
		next: varchar("next", { length: 255 })
			.references(() => quests.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => [
		unique("unique_quest_link").on(table.previous, table.next),
		index("previous_idx").on(table.previous),
		index("next_idx").on(table.next),
	]
);

export const questLinksRelations = relations(questLinks, ({ one }) => ({
	previous: one(quests, {
		fields: [questLinks.previous],
		references: [quests.id],
		relationName: "previous",
	}),
	next: one(quests, {
		fields: [questLinks.next],
		references: [quests.id],
		relationName: "next",
	}),
}));

const questEntryTypeValues = ["objective", "reward"] as const;
export const questEntryType = pgEnum("quest_entry_type", questEntryTypeValues);
export type QuestEntryType = (typeof questEntryTypeValues)[number];

export const questEntries = pgTable(
	"quest_entries",
	{
		id: serial("id").primaryKey(),
		questId: varchar("quest_id", { length: 255 })
			.references(() => quests.id, { onDelete: "cascade" })
			.notNull(),
		type: questEntryType("type").notNull(),
		description: text("description"),
	},
	(table) => [
		unique("unique_quest_entry").on(table.questId, table.type),
		index("quest_idx").on(table.questId),
		index("type_idx").on(table.type),
	]
);

export const questEntriesRelations = relations(questEntries, ({ one, many }) => ({
	quest: one(quests, { fields: [questEntries.questId], references: [quests.id] }),
	items: many(questEntryItems),
}));

export const questEntryItems = pgTable(
	"quest_entry_items",
	{
		questEntryId: integer("quest_entry_id")
			.references(() => questEntries.id, { onDelete: "cascade" })
			.notNull(),
		itemId: varchar("item_id", { length: 255 })
			.references(() => items.id, { onDelete: "cascade" })
			.notNull(),
		count: integer("count").notNull(),
	},
	(table) => [
		unique("unique_quest_entry_item").on(table.questEntryId, table.itemId),
		check("count_positive", sql`${table.count} > 0`),
		index("quest_entry_idx").on(table.questEntryId),
		index("quest_entry_item_idx").on(table.itemId),
	]
);

export const questEntryItemsRelations = relations(questEntryItems, ({ one }) => ({
	questEntry: one(questEntries, {
		fields: [questEntryItems.questEntryId],
		references: [questEntries.id],
	}),
	item: one(items, { fields: [questEntryItems.itemId], references: [items.id] }),
}));
