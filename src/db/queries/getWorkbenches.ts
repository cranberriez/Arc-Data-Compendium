import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { workbenches } from "../schema";
import { Workbench } from "@/types";

/**
 * Gets workbenches with optional recipe and tier requirement expansion.
 * @param id - Filter by workbench ID
 * @param fillTierRequirements - If true, includes item details for tier requirements
 */
export const getWorkbenches = async ({
	id,
	fillTierRequirements,
}: { id?: string; fillTierRequirements?: boolean } = {}): Promise<Workbench[]> => {
	try {
		return await db.query.workbenches.findMany({
			where: id ? eq(workbenches.id, id) : undefined,
			with: {
				tiers: {
					with: {
						requirements: {
							with: {
								item: fillTierRequirements ? true : undefined,
							},
						},
					},
				},
				workbenchRecipes: {
					with: {
						recipe: {
							with: {
								io: true,
							},
						},
					},
				},
			},
		});
	} catch (error) {
		console.error("Error querying workbenches:", error);
		return [];
	}
};

export const getWorkbenchIds = async (): Promise<string[]> => {
	try {
		return await db.query.workbenches
			.findMany({
				columns: {
					id: true,
				},
			})
			.then((workbenches) => workbenches.map((w) => w.id));
	} catch (error) {
		console.error("Error querying workbench IDs:", error);
		return [];
	}
};
