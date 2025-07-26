import { relations } from "drizzle-orm";
import {
	pgTable,
	integer,
	real,
	serial,
	text,
	foreignKey,
	unique,
	primaryKey,
} from "drizzle-orm/pg-core";
import { weapons } from "./weapons";
import { upgradeTypeEnum, statTypeEnum, modifierTypeEnum } from "./enums";

// Upgrade table
export const upgrade = pgTable(
	"weapon_upgrade",
	{
		id: serial("id").primaryKey(),
		parentId: integer("parent_id").notNull(),
		parentType: upgradeTypeEnum("parent_type").default("weapon").notNull(),
		level: integer("level").notNull(),
		description: text("description"),
	},
	(table) => [unique("unique_upgrade").on(table.parentType, table.parentId, table.level)]
);

export const upgradeRelations = relations(upgrade, ({ one, many }) => ({
	upgradeStats: many(upgradeStats),
}));

export const upgradeStats = pgTable(
	"weapon_upgrade_stats",
	{
		upgradeId: integer("upgrade_id")
			.notNull()
			.references(() => upgrade.id),
		statType: statTypeEnum("stat_type").notNull(),
		modifierType: modifierTypeEnum("modifier_type").notNull(),
		value: real("value").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.upgradeId],
			foreignColumns: [upgrade.id],
		}),
		primaryKey({
			columns: [table.upgradeId, table.statType],
		}),
	]
);

export const upgradeStatsRelations = relations(upgradeStats, ({ one }) => ({
	upgrade: one(upgrade, { fields: [upgradeStats.upgradeId], references: [upgrade.id] }),
}));
