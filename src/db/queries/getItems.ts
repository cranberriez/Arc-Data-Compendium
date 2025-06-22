import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { items } from "../schema";
import { Item, Weapon } from "@/types";

export const getItems = async ({ id }: { id?: string } = {}): Promise<Item[]> => {
	try {
		return await db.query.items.findMany({
			where: id ? eq(items.id, id) : undefined,
			with: {
				weapon: {
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

export const getWeapons = async ({ id }: { id?: string } = {}): Promise<Weapon[]> => {
	try {
		return await db.query.items.findMany({
			where: id ? eq(items.id, id) : eq(items.category, "weapon"),
			with: {
				weapon: {
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
