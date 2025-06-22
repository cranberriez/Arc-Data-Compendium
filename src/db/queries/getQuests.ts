import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { quests } from "../schema/quest";

export const getQuests = async ({ id, fillItems }: { id?: string; fillItems?: boolean } = {}) => {
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
