import { db } from "@/db/drizzle";
import { recipeItems, recipes } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// Returns an array of recipe sources for a single itemId
export async function getItemSources(itemId: string) {
	// 1. Find all recipeItems where role === 'output' and itemId matches
	const outputRecipeLinks = await db
		.select()
		.from(recipeItems)
		.where(eq(recipeItems.itemId, itemId))
		.then((rows) => rows.filter((r) => r.role === "output"));

	// 2. Get all unique recipeIds
	const recipeIds = [...new Set(outputRecipeLinks.map((r) => r.recipeId))];

	// 3. Get all recipeItems for those recipeIds
	const allRecipeItems = recipeIds.length
		? await db.select().from(recipeItems).where(inArray(recipeItems.recipeId, recipeIds))
		: [];

	// 4. Get all recipes for those recipeIds
	const allRecipes = recipeIds.length
		? await db.select().from(recipes).where(inArray(recipes.id, recipeIds))
		: [];

	// 5. Group recipeItems by recipeId
	const recipeItemsByRecipe: Record<string, typeof allRecipeItems> = {};
	for (const ri of allRecipeItems) {
		if (!recipeItemsByRecipe[ri.recipeId]) recipeItemsByRecipe[ri.recipeId] = [];
		recipeItemsByRecipe[ri.recipeId].push(ri);
	}

	const recipesById = Object.fromEntries(allRecipes.map((r) => [r.id, r]));

	// 6. Build sources array for this itemId
	const sources = outputRecipeLinks.map((link) => {
		const recipeItemList = recipeItemsByRecipe[link.recipeId] || [];
		return {
			recipeId: link.recipeId,
			recipe: recipesById[link.recipeId] ?? null,
			inputs: recipeItemList.filter((ri) => ri.role === "input"),
			outputs: recipeItemList.filter((ri) => ri.role === "output"),
		};
	});
	return sources;
}
