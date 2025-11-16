import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createdUpdatedColumns } from "./base";

export const versions = pgTable("versions", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	patchnotes: text("patchnotes"),
	version: varchar("version", { length: 64 }),
	releaseDate: timestamp("release_date", { withTimezone: true }),
	...createdUpdatedColumns,
});
