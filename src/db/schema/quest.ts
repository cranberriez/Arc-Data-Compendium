import { pgTable, pgEnum, integer } from "drizzle-orm/pg-core";
import { varchar, text, serial } from "drizzle-orm/pg-core";
import { createdUpdatedColumns } from "./base";
import { relations } from "drizzle-orm";
import { items } from "./items";

export const quests = pgTable("quests", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	trader: varchar("trader", { length: 255 }).notNull(),

	dialog: text("dialog").default(""),
	location: varchar("location", { length: 255 }).notNull(), // expand later with locations
	link: text("link").notNull(),
	xpReward: integer("xp_reward").notNull(),
	...createdUpdatedColumns,
});

export const questRelations = relations(quests, ({ one, many }) => ({
	entries: many(questEntries),
	prereq: many(quests, { relationName: "prereq" }),
	next: many(quests, { relationName: "next" }),
}));

const questEntryTypeValues = ["objective", "reward"] as const;
export const questEntryType = pgEnum("quest_entry_type", questEntryTypeValues);
export type QuestEntryType = (typeof questEntryTypeValues)[number];

export const questEntries = pgTable("quest_entries", {
	id: serial("id").primaryKey(),
	questId: varchar("quest_id", { length: 255 })
		.references(() => quests.id)
		.notNull(),
	type: questEntryType("type").notNull(),
	description: text("description").notNull(),
});

export const questEntriesRelations = relations(questEntries, ({ one, many }) => ({
	quest: one(quests, { fields: [questEntries.questId], references: [quests.id] }),
	items: many(questEntryItems),
}));

export const questEntryItems = pgTable("quest_entry_items", {
	id: serial("id").primaryKey(),
	questEntryId: integer("quest_entry_id")
		.references(() => questEntries.id)
		.notNull(),
	itemId: varchar("item_id", { length: 255 })
		.references(() => items.id)
		.notNull(),
	count: integer("count").notNull(),
});

export const questEntryItemsRelations = relations(questEntryItems, ({ one }) => ({
	questEntry: one(questEntries, {
		fields: [questEntryItems.questEntryId],
		references: [questEntries.id],
	}),
	item: one(items, { fields: [questEntryItems.itemId], references: [items.id] }),
}));
