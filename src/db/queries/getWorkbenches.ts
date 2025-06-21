import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { workbenches } from "../schema";

/**
 * Gets workbenches with optional recipe and tier requirement expansion.
 * @param id - Filter by workbench ID
 * @param fillTierRequirements - If true, includes item details for tier requirements
 */
export const getWorkbenches = ({
	id,
	fillTierRequirements,
}: { id?: string; fillTierRequirements?: boolean } = {}) => {
	return db.query.workbenches.findMany({
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
							locks: true,
						},
					},
				},
			},
		},
	});
};
