export interface FilterOptions {
	searchQuery?: string;
	rarities?: string[];
	categories?: string[];
}

export interface SortOptions {
	field: string;
	order: "asc" | "desc" | "none";
}
