import { db } from "../src/db/drizzle"; // your db instance
import recipeData from "../src/data/recipes/recipeData.json";
import { recipes, recipeItems, items, recipeLocks, workbenchRecipes } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { Recipe } from "../src/types/recipe";

export async function seedRecipes() {
	console.log("[seedRecipes] Starting recipe seeding process...");

	const typedRecipeData: Recipe[] = recipeData;

	for (const recipe of typedRecipeData) {
		console.log(`[seedRecipes][ACTIVE] Seeding recipe: ${recipe.id}`);
		try {
			await db
				.insert(recipes)
				.values({
					id: recipe.id,
					type: "crafting",
					inRaid: recipe.inRaid,
				} as any)
				.onConflictDoNothing();
			console.log(`[seedRecipes][SUCCESS] Inserted recipe: ${recipe.id}`);
		} catch (err) {
			console.error("Failed to insert recipe:", recipe, err);
			return;
		}

		// seed recipe inputs
		for (const entry of recipe.requirements) {
			console.log(
				`[seedRecipes][ACTIVE] Inserting recipe entry for recipe: ${recipe.id}, entry: ${entry.itemId}`
			);
			try {
				await db
					.insert(recipeItems)
					.values({
						recipeId: recipe.id,
						itemId: entry.itemId,
						qty: entry.count,
						role: "input",
					} as any)
					.onConflictDoNothing();
				console.log(
					`[seedRecipes][SUCCESS] Inserted recipe entry for recipe: ${recipe.id}, entry: ${entry.itemId}`
				);
			} catch (err) {
				console.error("Failed to insert recipe entry:", entry, err);
			}
		}

		// seed recipe outputs
		try {
			await db
				.insert(recipeItems)
				.values({
					recipeId: recipe.id,
					itemId: recipe.outputItemId,
					qty: recipe.outputCount,
					role: "output",
				} as any)
				.onConflictDoNothing();
			console.log(`[seedRecipes][SUCCESS] Inserted recipe output for recipe: ${recipe.id}`);
		} catch (err) {
			console.error("Failed to insert recipe output:", recipe, err);
			return;
		}

		// update recipe id for the output item
		await db
			.update(items)
			.set({ recipeId: recipe.id })
			.where(eq(items.id, recipe.outputItemId));

		// seed recipe lock
		if (recipe.isLocked) {
			try {
				await db
					.insert(recipeLocks)
					.values({
						recipeId: recipe.id,
						looted: recipe.lockedType?.looted ?? null,
						mastery: recipe.lockedType?.mastery ?? null,
						quest: recipe.lockedType?.quest ?? null,
						battlepass: recipe.lockedType?.battlepass ?? null,
						skill: recipe.lockedType?.skill ?? null,
						event: recipe.lockedType?.event ?? null,
						other: recipe.lockedType?.unsure ? "unsure" : null,
					} as any)
					.onConflictDoNothing();
				console.log(`[seedRecipes][SUCCESS] Inserted recipe lock for recipe: ${recipe.id}`);
			} catch (err) {
				console.error("Failed to insert recipe lock:", recipe, err);
				return;
			}
		}

		// seed workbench recipes
		if (recipe.workbench) {
			for (const [workbenchId, tier] of Object.entries(recipe.workbench)) {
				await db
					.insert(workbenchRecipes)
					.values({
						workbenchId,
						workbenchTier: Number(tier),
						recipeId: recipe.id,
					})
					.onConflictDoNothing();
			}
		}
	}
	console.log("[seedRecipes] Finished recipe seeding process.");
}

seedRecipes();
