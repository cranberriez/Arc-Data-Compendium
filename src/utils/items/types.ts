import { Rarity, ItemCategory } from "@/types";

export interface FilterOptions {
	searchQuery: string;
	rarities: Rarity[];
	categories: ItemCategory[];
	showRecyclable?: boolean;
	showCraftable?: boolean;
	showHasStats?: boolean;
}

export interface SortOptions {
	sortField: SortField;
	sortOrder: SortOrder;
}

export type SortField = "name" | "rarity" | "category" | "none";
export type SortOrder = "asc" | "desc" | "none";
