import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { recipes } from "../schema";

/**
 * Fetches all recipes (crafting and recycling) with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getRecipes = () => {
	return db.query.recipes.findMany({
		with: {
			io: true,
			locks: true,
		},
	});
};

/**
 * Fetches all crafting recipes with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getCraftingRecipes = () => {
	return db.query.recipes.findMany({
		where: eq(recipes.type, "crafting"),
		with: {
			io: true,
			locks: true,
		},
	});
};
