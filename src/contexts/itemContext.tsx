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
	getItemById: (id: string) => BaseItem | undefined;
	dialogQueue: BaseItem[];
	setDialogQueue: React.Dispatch<React.SetStateAction<BaseItem[]>>;
}

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
	// Memoize the combined items array to prevent recreation on every render
	const allItems = useMemo(() => [...items, ...valuables], []);

	const [dialogQueue, setDialogQueue] = useState<BaseItem[]>([]);
	const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortOrder, setSortOrder] = useState<SortOrder>("none");

	// Memoize the current items to prevent recalculation
	const currentItems = useMemo(() => itemsSubset || allItems, [itemsSubset, allItems]);

	const filteredItems = useMemo(() => {
		// Early return if no filters are active
		const noFilters = 
			!filterState.searchQuery && 
			filterState.rarities.length === 0 && 
			filterState.categories.length === 0 &&
			sortField === 'none' && 
			sortOrder === 'none';

		if (noFilters) {
			return currentItems;
		}

		let result = [...currentItems];

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
	}, [currentItems, filterState, sortField, sortOrder]);

	const setSearchQuery = useCallback((query: string) => {
		setFilterState((prev) => ({ ...prev, searchQuery: query }));
	}, [setFilterState]);

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

	const getItemById = useCallback(
		(id: string): BaseItem | undefined => {
			return currentItems.find((item) => item.id === id);
		},
		[currentItems]
	);

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
			getItemById,
			dialogQueue,
			setDialogQueue,
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
			getItemById,
			dialogQueue,
			setDialogQueue,
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
export function useFilteredItems(filterFn?: (item: BaseItem) => boolean) {
	const { filteredItems, ...rest } = useItems();
	// If a filter function is provided, apply it; otherwise, return all filteredItems.
	const scopedItems = filterFn ? filteredItems.filter(filterFn) : filteredItems;
	return { filteredItems: scopedItems, ...rest };
}

// Removed standalone getItemById to fix hook rules
// Use useItems() directly in components instead
