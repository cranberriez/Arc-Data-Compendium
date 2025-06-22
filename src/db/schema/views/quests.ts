import { pgView } from "drizzle-orm/pg-core";
import { quests, questLinks } from "..";
import { sql } from "drizzle-orm";

// Quest View for getting the "first" quest, get quest that is not present in any link's "next"
export const firstQuestsView = pgView("first_quests").as((qb) =>
	qb
		.select()
		.from(quests)
		.where(sql`${quests.id} NOT IN (SELECT ${questLinks.next} FROM ${questLinks})`)
);
