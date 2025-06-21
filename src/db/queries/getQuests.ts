import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { quests } from "../schema/quest";

export const getQuests = ({ id, fillItems }: { id?: string; fillItems?: boolean } = {}) => {
	return db.query.quests.findMany({
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
			previous: true,
			next: true,
		},
	});
};
