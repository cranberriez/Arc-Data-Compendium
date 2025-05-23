"use client";

import { createContext, ReactNode, useCallback, useMemo, useState, useContext } from "react";
import { BaseItem, Item } from "@/types";
import { items, valuables } from "@/data";
import { searchFunc } from "@/data/items/itemUtils";
import { addSources, composeProcessors, processItems } from "@/data/items/itemPreprocessor";

type SortOrder = "asc" | "desc" | "none";
type SortField = "name" | "rarity" | "category" | "value" | "none"; // 'category' replaces 'type' from legacy Item

interface FilterState {
	searchQuery: string;
	rarities: string[];
	categories: string[]; // replaces 'types' from legacy Item
}

interface ItemContextType {
	allItems: Item[];
	filteredItems: Item[];
	filterState: FilterState;
	sortField: SortField;
	sortOrder: SortOrder;
	setSearchQuery: (query: string) => void;
	setRarity: (rarity: string) => void;
	setCategory: (category: string) => void;
	toggleRarity: (rarity: string) => void;
	toggleCategory: (category: string) => void; // replaces toggleType
	setSort: (field: SortField, order: SortOrder) => void;
	resetFilters: () => void;
	getItemById: (id: string) => Item | undefined;
}

const defaultFilterState: FilterState = {
	searchQuery: "",
	rarities: [],
	categories: [],
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

// Rarity order mapping for default sort
const rarityOrder: Record<string, number> = {
	common: 1,
	uncommon: 2,
	rare: 3,
	epic: 4,
	legendary: 5,
};

export function ItemProvider({
	children,
	itemsSubset,
}: {
	children: ReactNode;
	itemsSubset?: Item[];
}) {
	// Compose item preprocessors
	// Expand to include validItem and processIcons when needed
	const itemProcessor = useMemo(() => composeProcessors<Item>(addSources), []);

	// Memoize the combined items array to prevent recreation on every render
	const allItems = useMemo(
		() => processItems([...items, ...valuables], itemProcessor),
		[itemProcessor]
	);
	const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortOrder, setSortOrder] = useState<SortOrder>("none");

	// Memoize the current items to prevent recalculation
	const currentItems = useMemo(() => itemsSubset || allItems, [itemsSubset, allItems]);

	const filteredItems = useMemo(() => {
		let result = [...currentItems];

		// Apply search filter
		if (filterState.searchQuery) {
			const query = filterState.searchQuery;
			result = result.filter((item) => searchFunc(item, query));
		}

		// Filter by rarity
		if (filterState.rarities.length > 0) {
			result = result.filter((item) => filterState.rarities.includes(item.rarity));
		}

		// Filter by category (was 'type')
		if (filterState.categories.length > 0) {
			result = result.filter((item) => filterState.categories.includes(item.category));
		}

		// Sorting
		if (sortField !== "none" && sortOrder !== "none") {
			// Explicit user sort
			result.sort((a, b) => {
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
		} else {
			// Default: sort by rarity, then name
			result.sort((a, b) => {
				const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
				if (rarityCompare !== 0) return rarityCompare;
				return a.name.localeCompare(b.name);
			});
		}

		return result;
	}, [currentItems, filterState, sortField, sortOrder]);

	const setSearchQuery = useCallback(
		(query: string) => {
			setFilterState((prev) => ({ ...prev, searchQuery: query }));
		},
		[setFilterState]
	);

	const setRarity = useCallback((rarity: string) => {
		setFilterState((prev) => ({ ...prev, rarities: [rarity] }));
	}, []);

	const setCategory = useCallback((category: string) => {
		setFilterState((prev) => ({ ...prev, categories: [category] }));
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
		setSortField("none");
		setSortOrder("none");
	}, [setSortField, setSortOrder]);

	const getItemById = useCallback(
		(id: string): Item | undefined => {
			return currentItems.find((item) => item.id === id) as Item | undefined;
		},
		[currentItems]
	);

	const value = useMemo(
		() => ({
			allItems,
			filteredItems,
			filterState,
			sortField,
			sortOrder,
			setSearchQuery,
			setRarity,
			setCategory,
			toggleRarity,
			toggleCategory,
			setSort,
			resetFilters,
			getItemById,
		}),
		[
			allItems,
			filteredItems,
			filterState,
			sortField,
			sortOrder,
			setSearchQuery,
			setRarity,
			setCategory,
			toggleRarity,
			toggleCategory,
			setSort,
			resetFilters,
			getItemById,
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

// TypeScript: You can type filterFn as (item: ItemType) => boolean if you have an Item type.
export function useFilteredItems(filterFn?: (item: Item) => boolean) {
	const { filteredItems, ...rest } = useItems();
	// If a filter function is provided, apply it; otherwise, return all filteredItems.
	const scopedItems = filterFn ? filteredItems.filter(filterFn) : filteredItems;
	return { filteredItems: scopedItems, ...rest };
}

// Removed standalone getItemById to fix hook rules
// Use useItems() directly in components instead
