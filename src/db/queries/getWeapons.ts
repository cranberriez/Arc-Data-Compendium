import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { items } from "../schema";
import { Weapon } from "@/types";

export const getWeapons = async ({ id }: { id?: string } = {}): Promise<Weapon[]> => {
	try {
		return await db.query.items.findMany({
			where: id ? eq(items.id, id) : eq(items.category, "weapon"),
			with: {
				weapon: {
					with: {
						upgrades: true,
					},
				},
				recipe: { with: { io: true } },
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
				version: true,
			},
		});
	} catch (error) {
		console.error("Error querying weapons:", error);
		return [];
	}
};
