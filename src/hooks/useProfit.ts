// Returns the profit of a given recipe or recipe array

import { useMemo } from "react";
import { Item, Recipe } from "@/types";
import { useItems } from "@/hooks/useData";
import { inputValueCalculator, buildInputItemsArray } from "@/utils/recipes/recipeUtils";

const computeProfit = (recipe: Recipe, getItemById: (id: string) => Item | undefined): number => {
	const output = recipe.io.find((item) => item.role === "output");
	if (!output) return 0;

	const outputCount = output.qty;
	const outputItem = getItemById(output.itemId);
	if (!outputItem) return 0;

	const inputItems = buildInputItemsArray(recipe, getItemById);
	const inputValue = inputValueCalculator(inputItems);
	const outputValue = outputItem.value * outputCount;
	return outputValue - inputValue;
};

export const useProfit = (recipe: Recipe | Recipe[]) => {
	const { getItemById } = useItems();

	return useMemo(() => {
		if (Array.isArray(recipe)) {
			return recipe.map((r) => computeProfit(r, getItemById));
		}
		return computeProfit(recipe, getItemById);
	}, [recipe, getItemById]);
};

export type RecipeWithProfit = Recipe & { profit: number };

export const useProfitableRecipes = (recipes: Recipe[]) => {
	const { getItemById } = useItems();

	return useMemo<RecipeWithProfit[]>(() => {
		const withProfit = recipes.map((r) => ({ ...r, profit: computeProfit(r, getItemById) }));
		return withProfit.filter((r) => r.profit > 0);
	}, [recipes, getItemById]);
};
