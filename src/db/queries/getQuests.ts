import { db } from "../drizzle";
import { eq, sql } from "drizzle-orm";
import { quests } from "../schema/quest";
import { Quest } from "@/types";

export const getQuests = async ({
	id,
	fillItems,
}: { id?: string; fillItems?: boolean } = {}): Promise<Quest[]> => {
	try {
		// Fetch quests with entry & link relations first
		const questsData = await db.query.quests.findMany({
			where: id ? eq(quests.id, id) : undefined,
			with: {
				entries: {
					with: {
						items: {
							with: {
								item: fillItems ? true : undefined,
							},
						},
					},
				},
				previous: {
					columns: {
						next: true,
					},
				},
				next: {
					columns: {
						previous: true,
					},
				},
			},
		});

		// Flatten the relation arrays so callers don't have to deal with the join table shape.
		return questsData.map((q) => {
			// Previous quest ids are the `previous` column inside the `next` relation rows.
			const previousQuestIds = q.next.map((l) => l.previous);

			// Next quest ids are the `next` column inside the `previous` relation rows.
			const nextQuestIds = q.previous.map((l) => l.next);

			// Strip the raw link arrays and replace them with simple id arrays
			const { previous: _prevLinks, next: _nextLinks, ...rest } = q as any;
			return {
				...rest,
				previous: previousQuestIds,
				next: nextQuestIds,
			};
		});
	} catch (error) {
		console.error("Error querying quests:", error);
		return [];
	}
};

export const getQuestIds = async (): Promise<string[]> => {
	try {
		return await db.query.quests
			.findMany({
				columns: {
					id: true,
				},
			})
			.then((quests) => quests.map((q) => q.id));
	} catch (error) {
		console.error("Error querying quest IDs:", error);
		return [];
	}
};

export const getFirstQuestId = async (): Promise<string> => {
	try {
		return db.query.quests
			.findFirst({
				columns: {
					id: true,
				},
				where: sql`NOT EXISTS (SELECT 1 FROM quest_links WHERE quest_links.next = quests.id)`,
			})
			.then((quest) => quest?.id ?? "");
	} catch (error) {
		console.error("Error querying first quest ID:", error);
		return "";
	}
};
