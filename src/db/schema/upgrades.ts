import { relations } from "drizzle-orm";
import { pgTable, integer, serial, text, foreignKey, unique, varchar, jsonb } from "drizzle-orm/pg-core";
import { weapons } from "./weapons";
import { recipes } from "./recipes";

// Upgrade table
export const upgrade = pgTable(
	"weapon_upgrade",
	{
		id: serial("id").primaryKey(),
		weaponId: integer("weapon_id")
			.notNull()
			.references(() => weapons.id),
		level: integer("level").notNull(),
		description: text("description"),
		// Per-tier perks stored as canonical JSON (object keyed by normalized metric)
		perks: jsonb("perks").notNull().default(JSON.stringify({})),
		// Optional cost linkage via recipes table
		recipeId: varchar("recipe_id", { length: 255 }).references(() => recipes.id),
		sellPrice: integer("sell_price"),
	},
	(table) => [
		foreignKey({ columns: [table.weaponId], foreignColumns: [weapons.id] }),
		unique("unique_weapon_upgrade").on(table.weaponId, table.level),
	]
);

export const upgradeRelations = relations(upgrade, ({ one }) => ({
	weapon: one(weapons, { fields: [upgrade.weaponId], references: [weapons.id] }),
}));
