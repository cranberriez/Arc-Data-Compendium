// import { db } from "../drizzle";
// import { recipes, recipeItems, recipeLocks } from "../schema";
// import { eq, inArray } from "drizzle-orm";
// import { Recipe, RecipeBase, RecipeIO } from "@/types/schema";

import { eq } from "drizzle-orm";
import { db } from "../drizzle";

// type GetRecipesOptions = {
// 	id?: string;
// };

/**
 * Fetches recipes with their inputs, outputs, and locks in an optimized way.
 *
 * - If an ID is provided, fetches only the matching recipe; otherwise, fetches all recipes.
 * - Batches DB calls for recipe items and locks for all relevant recipes.
 * - Groups items and locks in memory by recipeId for efficient assembly.
 *
 * @param options - Optional parameters to filter recipes
 * @param options.id - Optional recipe ID to fetch a specific recipe
 * @returns Array of recipes with all their details, or empty array if none found
 */
/**
export async function getRecipes(options?: GetRecipesOptions): Promise<Recipe[]> {
	// Step 1: Fetch base recipe(s)
	let recipeResults: RecipeBase[];

	// Step 2: If an ID is provided, fetch that recipe; otherwise, fetch all recipes
	if (options?.id) {
		const recipe = await db.query.recipes.findFirst({
			where: eq(recipes.id, options.id),
		});
		recipeResults = recipe ? [recipe] : [];
	} else {
		recipeResults = await db.query.recipes.findMany();
	}

	// Step 3: Early return if no recipes found
	if (recipeResults.length === 0) {
		return [];
	}

	// Step 4: Collect all recipe IDs
	const recipeIds = recipeResults.map((r) => r.id);

	// Step 5: Batch fetch all recipeItems for these recipes
	const allRecipeItems = await db.query.recipeItems.findMany({
		where: inArray(recipeItems.recipeId, recipeIds),
	});

	// Step 6: Batch fetch all recipeLocks for these recipes
	const allRecipeLocks = await db.query.recipeLocks.findMany({
		where: inArray(recipeLocks.recipeId, recipeIds),
	});

	// Step 7: Group recipeItems by recipeId
	const itemsByRecipeId: Record<string, RecipeIO[]> = {};
	for (const ri of allRecipeItems) {
		if (!itemsByRecipeId[ri.recipeId]) itemsByRecipeId[ri.recipeId] = [];
		itemsByRecipeId[ri.recipeId].push(ri as RecipeIO);
	}

	// Step 8: Group recipeLocks by recipeId
	const locksByRecipeId: Record<string, (typeof allRecipeLocks)[number] | null> = {};
	for (const lock of allRecipeLocks) {
		locksByRecipeId[lock.recipeId] = lock;
	}

	// Step 9: Assemble the results by attaching grouped items and locks to each recipe
	const recipesWithDetails = recipeResults.map((recipe) => {
		const recipeItemsResult = itemsByRecipeId[recipe.id] ?? [];
		const inputs = recipeItemsResult.filter((ri) => ri.role === "input");
		const outputs = recipeItemsResult.filter((ri) => ri.role === "output");
		const recipeLockResult = locksByRecipeId[recipe.id] ?? null;

		return {
			...recipe,
			inputs,
			outputs,
			locks: recipeLockResult,
		};
	});

	// Step 10: Return the fully assembled recipes array
	return recipesWithDetails;
}
*/

/**
 * Fetches only crafting recipes with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getRecipes = () => {
	return db.query.recipes.findMany({
		where: eq(recipes.type, "crafting"),
		with: {
			io: true,
			locks: true,
		},
	});
};

/**
 * Fetches all recipes (crafting and recycling) with all their details
 *
 * @returns Array of recipes with all their details, or empty array if none found
 */
export const getAllRecipes = () => {
	return db.query.recipes.findMany({
		with: {
			io: true,
			locks: true,
		},
	});
};
