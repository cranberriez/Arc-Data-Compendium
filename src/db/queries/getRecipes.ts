import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { recipes } from "../schema";
import { Recipe } from "@/types";

/**
 * Fetches all recipes (crafting and recycling) with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getRecipes = async ({ id }: { id?: string } = {}): Promise<Recipe[]> => {
	try {
		return await db.query.recipes.findMany({
			where: id ? eq(recipes.id, id) : undefined,
			with: {
				io: true,
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
export const getCraftingRecipes = async ({ id }: { id?: string } = {}): Promise<Recipe[]> => {
	try {
		return await db.query.recipes.findMany({
			where: id ? eq(recipes.id, id) : eq(recipes.type, "crafting"),
			with: {
				io: true,
			},
		});
	} catch (error) {
		console.error("Error querying crafting recipes:", error);
		return [];
	}
};
