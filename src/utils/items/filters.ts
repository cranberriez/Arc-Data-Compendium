import { Item } from "@/types";
import { FilterOptions } from "./types";
import { searchFunc } from "@/data/items/itemUtils";

// Individual filter predicates
const matchesSearch = (item: Item, query: string): boolean => {
	return !query || searchFunc(item, query);
};

const matchesRarity = (item: Item, rarities: string[]): boolean => {
	return !rarities?.length || rarities.includes(item.rarity);
};

const matchesCategory = (item: Item, categories: string[]): boolean => {
	return !categories?.length || categories.includes(item.category);
};

const isRecyclable = (item: Item): boolean => {
	return Array.isArray(item.recycling) && item.recycling.length > 0;
};

const isCraftable = (item: Item): boolean => {
	return !!item.recipeId;
};

const hasStats = (item: Item): boolean => {
	return !!(item.quickUse || item.gear);
};

export const applyItemFilters = (items: Item[], filters: FilterOptions): Item[] => {
	return items.filter((item) => {
		// Apply all filters in a single pass
		if (!matchesSearch(item, filters.searchQuery)) return false;
		if (!matchesRarity(item, filters.rarities)) return false;
		if (!matchesCategory(item, filters.categories)) return false;

		// Apply new filters if they are active
		if (filters.showRecyclable && !isRecyclable(item)) return false;
		if (filters.showCraftable && !isCraftable(item)) return false;
		if (filters.showHasStats && !hasStats(item)) return false;

		return true;
	});
};

// Export individual filters for testing and UI count purposes
export const filterBySearch = (items: Item[], query: string): Item[] =>
	items.filter((item) => matchesSearch(item, query));

export const filterByRarity = (items: Item[], rarities: string[]): Item[] =>
	items.filter((item) => matchesRarity(item, rarities));

export const filterByCategory = (items: Item[], categories: string[]): Item[] =>
	items.filter((item) => matchesCategory(item, categories));

export const filterByRecyclable = (items: Item[]): Item[] => items.filter(isRecyclable);

export const filterByCraftable = (items: Item[]): Item[] => items.filter(isCraftable);

export const filterByHasStats = (items: Item[]): Item[] => items.filter(hasStats);
