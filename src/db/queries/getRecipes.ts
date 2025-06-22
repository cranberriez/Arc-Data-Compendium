import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { recipes } from "../schema";

/**
 * Fetches all recipes (crafting and recycling) with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getRecipes = async () => {
	try {
		return await db.query.recipes.findMany({
			with: {
				io: true,
				locks: true,
			},
		});
	} catch (error) {
		console.error("Error querying recipes:", error);
		return [];
	}
};

/**
 * Fetches all crafting recipes with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getCraftingRecipes = async () => {
	try {
		return await db.query.recipes.findMany({
			where: eq(recipes.type, "crafting"),
			with: {
				io: true,
				locks: true,
			},
		});
	} catch (error) {
		console.error("Error querying crafting recipes:", error);
		return [];
	}
};
