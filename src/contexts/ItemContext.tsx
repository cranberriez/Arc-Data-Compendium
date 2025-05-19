"use client";

import { createContext, ReactNode, useCallback, useMemo, useState, useContext } from "react";
import { BaseItem } from "@/types/items/base";
import { items } from "@/data/items/itemHandler";
import { valuables } from "@/data/valuables/valuableHandler";

type SortOrder = "asc" | "desc" | "none";
type SortField = "name" | "rarity" | "category" | "value" | "none"; // 'category' replaces 'type' from legacy Item

interface FilterState {
	searchQuery: string;
	rarities: string[];
	categories: string[]; // replaces 'types' from legacy Item
}

interface ItemContextType {
	items: BaseItem[];
	filteredItems: BaseItem[];
	filterState: FilterState;
	sortField: SortField;
	sortOrder: SortOrder;
	setSearchQuery: (query: string) => void;
	toggleRarity: (rarity: string) => void;
	toggleCategory: (category: string) => void; // replaces toggleType
	setSort: (field: SortField, order: SortOrder) => void;
	resetFilters: () => void;
}

const allItems = [...items, ...valuables];

const defaultFilterState: FilterState = {
	searchQuery: "",
	rarities: [],
	categories: [],
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({
	children,
	itemsSubset,
}: {
	children: ReactNode;
	itemsSubset?: BaseItem[];
}) {
	const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortOrder, setSortOrder] = useState<SortOrder>("none");

	const filteredItems = useMemo(() => {
		let result = [...(itemsSubset || allItems)];

		// Apply search filter
		if (filterState.searchQuery) {
			const query = filterState.searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
			);
		}

		// Filter by rarity
		if (filterState.rarities.length > 0) {
			result = result.filter((item) => filterState.rarities.includes(item.rarity));
		}

		// Filter by category (was 'type')
		if (filterState.categories.length > 0) {
			result = result.filter((item) => filterState.categories.includes(item.category));
		}

		// Define rarity order for sorting
		const rarityOrder: Record<string, number> = {
			common: 1,
			uncommon: 2,
			rare: 3,
			epic: 4,
			legendary: 5,
		};

		// Apply sorting
		result.sort((a, b) => {
			// Default: sort by rarity then name
			if (sortField === "none" || sortOrder === "none") {
				const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
				if (rarityCompare !== 0) return rarityCompare;
				return a.name.localeCompare(b.name);
			}

			let aValue: any, bValue: any;

			if (sortField === "name") {
				aValue = a.name.toLowerCase();
				bValue = b.name.toLowerCase();
			} else if (sortField === "category") {
				aValue = a.category;
				bValue = b.category;
			} else {
				aValue = a[sortField as keyof BaseItem];
				bValue = b[sortField as keyof BaseItem];
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return result;
	}, [items, itemsSubset, filterState, sortField, sortOrder]);

	const setSearchQuery = useCallback((query: string) => {
		setFilterState((prev) => ({ ...prev, searchQuery: query }));
	}, []);

	const toggleRarity = useCallback((rarity: string) => {
		setFilterState((prev) => {
			const newRarities = prev.rarities.includes(rarity)
				? prev.rarities.filter((r) => r !== rarity)
				: [...prev.rarities, rarity];
			return { ...prev, rarities: newRarities };
		});
	}, []);

	const toggleCategory = useCallback((category: string) => {
		setFilterState((prev) => {
			const newCategories = prev.categories.includes(category)
				? prev.categories.filter((c) => c !== category)
				: [...prev.categories, category];
			return { ...prev, categories: newCategories };
		});
	}, []);

	const setSort = useCallback((field: SortField, order: SortOrder) => {
		setSortField(field);
		setSortOrder(order);
	}, []);

	const resetFilters = useCallback(() => {
		setFilterState(defaultFilterState);
		setSortField("name");
		setSortOrder("asc");
	}, [setSortField, setSortOrder]);

	const value = useMemo(
		() => ({
			items,
			filteredItems,
			filterState,
			sortField,
			sortOrder,
			setSearchQuery,
			toggleRarity,
			toggleCategory,
			setSort,
			resetFilters,
		}),
		[
			filteredItems,
			filterState,
			sortField,
			sortOrder,
			setSearchQuery,
			toggleRarity,
			toggleCategory,
			setSort,
			resetFilters,
			items,
		]
	);

	return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}

export function useItems() {
	const context = useContext(ItemContext);
	if (context === undefined) {
		throw new Error("useItems must be used within an ItemProvider");
	}
	return context;
}
