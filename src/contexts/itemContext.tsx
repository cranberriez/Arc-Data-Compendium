"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useMemo,
	useState,
	useContext,
	useEffect,
} from "react";
import { applyItemFilters, sortItems, SortField, SortOrder } from "@/utils/items";

import { Item, ItemCategory, Rarity } from "@/types";
import { addSources, composeProcessors, processItems } from "@/data/items/itemPreprocessor";
import { fetchItems, fetchValuables } from "@/services/dataService";
import { FilterOptions, SortOptions } from "@/utils/items/types";

interface ItemContextType {
	allItems: Item[];
	filteredItems: Item[];
	filterState: FilterOptions;
	sortState: SortOptions;
	isLoading: boolean;
	error: string | null;
	setSearchQuery: (query: string) => void;
	setRarity: (rarities: Rarity[]) => void;
	setCategory: (categories: ItemCategory[]) => void;
	toggleRarity: (rarity: Rarity) => void;
	toggleCategory: (category: ItemCategory) => void;
	toggleRecyclable: () => void;
	toggleCraftable: () => void;
	toggleHasStats: () => void;
	setSort: (field: SortField, order: SortOrder) => void;
	resetFilters: () => void;
	getItemById: (id: string) => Item | undefined;
}

const defaultFilterState: FilterOptions = {
	searchQuery: "",
	rarities: [],
	categories: [],
	showRecyclable: false,
	showCraftable: false,
	showHasStats: false,
};

const defaultSortState: SortOptions = {
	sortField: "none",
	sortOrder: "none",
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: ReactNode }) {
	// Compose item preprocessors
	// Expand to include validItem and processIcons when needed
	const itemProcessor = useMemo(() => composeProcessors<Item>(addSources), []);

	// State for storing fetched items
	const [allItems, setAllItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch data from API endpoints
	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			try {
				const [fetchedItems, fetchedValuables] = await Promise.all([
					fetchItems(),
					fetchValuables(),
				]);

				// Process items with the processor if needed
				const processedItems = processItems(
					[...fetchedItems, ...fetchedValuables],
					itemProcessor
				);
				setAllItems(processedItems);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch items:", err);
				setError("Failed to load items. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, [itemProcessor]);

	// State for filter and sort
	const [filterState, setFilterState] = useState<FilterOptions>(defaultFilterState);
	const [sortState, setSortState] = useState<SortOptions>(defaultSortState);

	// Memoize the current items to prevent recalculation
	const currentItems = useMemo(() => allItems, [allItems]);

	// Memoize the filtered items based on filter state only
	const filteredByFilters = useMemo(() => {
		return applyItemFilters(currentItems, filterState);
	}, [currentItems, filterState]);

	// Memoize the sorted items based on the filtered items and sort state
	const filteredItems = useMemo(() => {
		return sortItems(filteredByFilters, sortState);
	}, [filteredByFilters, sortState]);

	const setSearchQuery = useCallback(
		(query: string) => {
			setFilterState((prev) => ({ ...prev, searchQuery: query }));
		},
		[setFilterState]
	);

	const setRarity = useCallback((rarities: Rarity[]) => {
		setFilterState((prev) => ({ ...prev, rarities }));
	}, []);

	const setCategory = useCallback((categories: ItemCategory[]) => {
		setFilterState((prev) => ({ ...prev, categories }));
	}, []);

	const toggleRarity = useCallback((rarity: Rarity) => {
		setFilterState((prev) => {
			// Use a Set for more efficient inclusion check and filtering
			const raritySet = new Set(prev.rarities);
			if (raritySet.has(rarity)) {
				raritySet.delete(rarity);
			} else {
				raritySet.add(rarity);
			}
			return { ...prev, rarities: Array.from(raritySet) };
		});
	}, []);

	const toggleCategory = useCallback((category: ItemCategory) => {
		setFilterState((prev) => {
			// Use a Set for more efficient inclusion check and filtering
			const categorySet = new Set(prev.categories);
			if (categorySet.has(category)) {
				categorySet.delete(category);
			} else {
				categorySet.add(category);
			}
			return { ...prev, categories: Array.from(categorySet) };
		});
	}, []);

	const toggleRecyclable = useCallback(() => {
		setFilterState((prev) => ({
			...prev,
			showRecyclable: !prev.showRecyclable,
		}));
	}, []);

	const toggleCraftable = useCallback(() => {
		setFilterState((prev) => ({
			...prev,
			showCraftable: !prev.showCraftable,
		}));
	}, []);

	const toggleHasStats = useCallback(() => {
		setFilterState((prev) => ({
			...prev,
			showHasStats: !prev.showHasStats,
		}));
	}, []);

	const setSort = useCallback((field: SortField, order: SortOrder) => {
		setSortState((prev) => ({ ...prev, sortField: field, sortOrder: order }));
	}, []);

	const resetFilters = useCallback(() => {
		// Use requestAnimationFrame instead of setTimeout for better performance
		setIsLoading(true);

		requestAnimationFrame(() => {
			setFilterState(defaultFilterState);
			setSortState(defaultSortState);

			// Use another requestAnimationFrame to ensure UI updates before removing loading state
			requestAnimationFrame(() => {
				setIsLoading(false);
			});
		});
	}, []);

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
			sortState,
			isLoading,
			error,
			setSearchQuery,
			setRarity,
			setCategory,
			toggleRarity,
			toggleCategory,
			toggleRecyclable,
			toggleCraftable,
			toggleHasStats,
			setSort,
			resetFilters,
			getItemById,
		}),
		[
			allItems,
			filteredItems,
			filterState,
			sortState,
			isLoading,
			error,
			setSearchQuery,
			setRarity,
			setCategory,
			toggleRarity,
			toggleCategory,
			toggleRecyclable,
			toggleCraftable,
			toggleHasStats,
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
