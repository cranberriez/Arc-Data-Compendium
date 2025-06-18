// sharedColumns.ts
import { varchar, timestamp, text, integer, real, jsonb } from "drizzle-orm/pg-core";

export const createdUpdatedColumns = {
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
};

// Define shared columns as an object
export const baseItemColumns = {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").default(""),
	icon: varchar("icon", { length: 255 }).default("FileQuestion").notNull(),
	...createdUpdatedColumns,
};
