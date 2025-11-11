import { useDataStore } from "@/stores";
import { Item, Recipe, Quest, Workbench } from "@/types";
import { useMemo } from "react";
import { useUIStore } from "@/stores";
import { applyItemFilters, sortItems } from "@/utils/items";
import { DataStore, UIStore } from "@/stores/types";

// Simple hooks for accessing individual data types
export const useItems = () => {
	const items = useDataStore((state: DataStore) => state.items);
	const getItemById = useDataStore((state: DataStore) => state.getItemById);
	const isLoading = useDataStore((state: DataStore) => state.isLoading);
	const error = useDataStore((state: DataStore) => state.error);

	return { items, getItemById, isLoading, error };
};

export const useRecipes = () => {
	const recipes = useDataStore((state: DataStore) => state.recipes);
	const getRecipeById = useDataStore((state: DataStore) => state.getRecipeById);
	const getCraftingRecipes = useDataStore((state: DataStore) => state.getCraftingRecipes);
	const getRecyclingRecipes = useDataStore((state: DataStore) => state.getRecyclingRecipes);
	const getRecyclingSourcesById = useDataStore(
		(state: DataStore) => state.getRecyclingSourcesById
	);
	const isLoading = useDataStore((state: DataStore) => state.isLoading);
	const error = useDataStore((state: DataStore) => state.error);

	return {
		recipes,
		getRecipeById,
		getCraftingRecipes,
		getRecyclingRecipes,
		getRecyclingSourcesById,
		isLoading,
		error,
	};
};

export const useQuests = () => {
	const quests = useDataStore((state: DataStore) => state.quests);
	const getQuestById = useDataStore((state: DataStore) => state.getQuestById);
	const isLoading = useDataStore((state: DataStore) => state.isLoading);
	const error = useDataStore((state: DataStore) => state.error);

	return { quests, getQuestById, isLoading, error };
};

export const useWorkbenches = () => {
	const workbenches = useDataStore((state: DataStore) => state.workbenches);
	const getWorkbenchById = useDataStore((state: DataStore) => state.getWorkbenchById);
	const isLoading = useDataStore((state: DataStore) => state.isLoading);
	const error = useDataStore((state: DataStore) => state.error);

	return { workbenches, getWorkbenchById, isLoading, error };
};

// Hook for getting a single item by ID
export const useItem = (id: string): Item | undefined => {
	return useDataStore((state: DataStore) => state.getItemById(id));
};

// Hook for getting a single recipe by ID
export const useRecipe = (id: string): Recipe | undefined => {
	return useDataStore((state: DataStore) => state.getRecipeById(id));
};

// Hook for getting a single quest by ID
export const useQuest = (id: string): Quest | undefined => {
	return useDataStore((state: DataStore) => state.getQuestById(id));
};

// Hook for getting a single workbench by ID
export const useWorkbench = (id: string): Workbench | undefined => {
	return useDataStore((state: DataStore) => state.getWorkbenchById(id));
};

// Hook for filtered and sorted items (replaces the complex ItemContext logic)
export const useFilteredItems = () => {
	const items = useDataStore((state: DataStore) => state.items);
	const filters = useUIStore((state: UIStore) => state.itemFilters);
	const sort = useUIStore((state: UIStore) => state.itemSort);

	const filteredItems = useMemo(() => {
		const filtered = applyItemFilters(items, filters);
		return sortItems(filtered, sort);
	}, [items, filters, sort]);

	return filteredItems;
};

// Hook for items with custom filter function
export const useFilteredItemsWithCustomFilter = (filterFn?: (item: Item) => boolean) => {
	const filteredItems = useFilteredItems();

	return useMemo(() => {
		return filterFn ? filteredItems.filter(filterFn) : filteredItems;
	}, [filteredItems, filterFn]);
};
