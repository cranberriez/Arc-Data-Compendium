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

export function groupRecipesByWorkbenchTier(recipes: Recipe[]) {
	const tierMap: Record<number, Recipe[]> = {};
	for (const recipe of recipes) {
		if (!recipe.workbench) continue;
		for (const unlockedTier of Object.values(recipe.workbench)) {
			if (!(unlockedTier in tierMap)) tierMap[unlockedTier] = [];
			tierMap[unlockedTier].push(recipe);
		}
	}
	return tierMap;
}
