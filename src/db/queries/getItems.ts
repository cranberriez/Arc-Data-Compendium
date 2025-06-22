import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { items } from "../schema";

export const getItems = async ({ id }: { id?: string } = {}) => {
	try {
		return await db.query.items.findMany({
			where: id ? eq(items.id, id) : undefined,
			with: {
				weapon: {
					columns: { id: false, itemId: false },
					with: {
						weaponStats: true,
						upgrades: { with: { upgradeStats: true } },
					},
				},
				recipe: { with: { io: true, locks: true } },
				recycling: { with: { io: true } },
				questEntries: {
					with: {
						questEntry: {
							columns: {
								type: true,
							},
						},
					},
				},
				workbenchRequirements: true,
			},
		});
	} catch (error) {
		console.error("Error querying items:", error);
		return [];
	}
};

export const getWeapons = async ({ id }: { id?: string } = {}) => {
	try {
		return await db.query.items.findMany({
			where: id ? eq(items.id, id) : eq(items.category, "weapon"),
			with: {
				weapon: {
					columns: { id: false, itemId: false },
					with: {
						weaponStats: true,
						upgrades: { with: { upgradeStats: true } },
					},
				},
				recipe: { with: { io: true, locks: true } },
				recycling: { with: { io: true } },
				questEntries: {
					with: {
						questEntry: {
							columns: {
								type: true,
							},
						},
					},
				},
				workbenchRequirements: true,
			},
		});
	} catch (error) {
		console.error("Error querying weapons:", error);
		return [];
	}
};
