export interface FilterOptions {
	searchQuery: string;
	rarities: string[];
	categories: string[];
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
