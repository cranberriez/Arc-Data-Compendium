import { Item } from "@/types";
import { FilterOptions } from "./types";
import { searchFunc } from "@/data/items/itemUtils";

export const filterBySearch = (items: Item[], query: string): Item[] => {
	if (!query) return items;
	return items.filter((item) => searchFunc(item, query));
};

export const filterByRarity = (items: Item[], rarities: string[]): Item[] => {
	if (!rarities?.length) return items;
	return items.filter((item) => rarities.includes(item.rarity));
};

export const filterByCategory = (items: Item[], categories: string[]): Item[] => {
	if (!categories?.length) return items;
	return items.filter((item) => categories.includes(item.category));
};

export const applyItemFilters = (items: Item[], filters: FilterOptions): Item[] => {
	let result = [...items];
	result = filterBySearch(result, filters.searchQuery || "");
	result = filterByRarity(result, filters.rarities || []);
	result = filterByCategory(result, filters.categories || []);
	return result;
};
