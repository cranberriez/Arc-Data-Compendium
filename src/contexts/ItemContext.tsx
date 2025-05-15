"use client";

import { createContext, ReactNode, useCallback, useMemo, useState, useContext } from "react";
import { Item } from "@/data/items/types";
import { items } from "@/data/items/itemHandler";

type SortOrder = "asc" | "desc" | "none";
type SortField = "name" | "rarity" | "type" | "value" | "none";

interface FilterState {
	searchQuery: string;
	rarities: string[];
	types: string[];
}

interface ItemContextType {
	items: Item[];
	filteredItems: Item[];
	filterState: FilterState;
	sortField: SortField;
	sortOrder: SortOrder;
	setSearchQuery: (query: string) => void;
	toggleRarity: (rarity: string) => void;
	toggleType: (type: string) => void;
	setSort: (field: SortField, order: SortOrder) => void;
	resetFilters: () => void;
}

const defaultFilterState: FilterState = {
	searchQuery: "",
	rarities: [],
	types: [],
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({
	children,
	itemsSubset,
}: {
	children: ReactNode;
	itemsSubset?: Item[];
}) {
	const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortOrder, setSortOrder] = useState<SortOrder>("none");

	const filteredItems = useMemo(() => {
		let result = [...(itemsSubset || items)];

		// Apply filters
		if (filterState.searchQuery) {
			const query = filterState.searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.display_name.toLowerCase().includes(query) ||
					item.id.toLowerCase().includes(query)
			);
		}

		if (filterState.rarities.length > 0) {
			result = result.filter((item) => filterState.rarities.includes(item.rarity));
		}

		if (filterState.types.length > 0) {
			result = result.filter((item) => filterState.types.includes(item.type));
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
			// If sort is set to 'none', sort by rarity then name
			if (sortField === "none" || sortOrder === "none") {
				const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
				if (rarityCompare !== 0) return rarityCompare;
				return a.display_name.localeCompare(b.display_name);
			}

			// Original sorting logic for other sort fields
			let aValue: any, bValue: any;

			if (sortField === "name") {
				aValue = a.display_name.toLowerCase();
				bValue = b.display_name.toLowerCase();
			} else {
				aValue = a[sortField as keyof Item];
				bValue = b[sortField as keyof Item];
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return result;
	}, [items, filterState, sortField, sortOrder]);

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

	const toggleType = useCallback((type: string) => {
		setFilterState((prev) => {
			const newTypes = prev.types.includes(type)
				? prev.types.filter((t) => t !== type)
				: [...prev.types, type];
			return { ...prev, types: newTypes };
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
			toggleType,
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
			toggleType,
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
