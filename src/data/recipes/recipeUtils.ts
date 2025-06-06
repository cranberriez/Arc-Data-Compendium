import { Recipe } from "@/types";

export function filterRecipeByWorkbenchTier(recipes: Recipe[], tier: number) {
	return recipes.filter((recipe) => {
		if (!recipe.workbench) return false;
		return Object.values(recipe.workbench).some((unlockedTier) => unlockedTier === tier);
	});
}

export function filterRecipesAvailableByTier(recipes: Recipe[], tier: number) {
	return recipes.filter((recipe) => {
		if (!recipe.workbench) return false;
		return Object.values(recipe.workbench).some((unlockedTier) => unlockedTier <= tier);
	});
}

import type { WorkbenchId } from "@/types";

export function groupRecipesByWorkbenchTier(recipes: Recipe[], workbenchId: WorkbenchId) {
	const tierMap: Record<number, Recipe[]> = {};
	for (const recipe of recipes) {
		if (!recipe.workbench || !(workbenchId in recipe.workbench)) continue;
		const unlockedTier = recipe.workbench[workbenchId];
		if (unlockedTier === undefined) continue;
		if (!(unlockedTier in tierMap)) tierMap[unlockedTier] = [];
		tierMap[unlockedTier].push(recipe);
	}
	return tierMap;
}
