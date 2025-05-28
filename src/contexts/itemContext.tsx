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
	setRarity: (rarity: Rarity) => void;
	setCategory: (category: ItemCategory) => void;
	toggleRarity: (rarity: Rarity) => void;
	toggleCategory: (category: ItemCategory) => void;
	setSort: (field: SortField, order: SortOrder) => void;
	resetFilters: () => void;
	getItemById: (id: string) => Item | undefined;
}

const defaultFilterState: FilterOptions = {
	searchQuery: "",
	rarities: [],
	categories: [],
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

	const filteredItems = useMemo(() => {
		const filtered = applyItemFilters(currentItems, filterState);

		return sortItems(filtered, sortState);
	}, [currentItems, filterState, sortState]);

	const setSearchQuery = useCallback(
		(query: string) => {
			setFilterState((prev) => ({ ...prev, searchQuery: query }));
		},
		[setFilterState]
	);

	const setRarity = useCallback((rarity: Rarity) => {
		setFilterState((prev) => ({ ...prev, rarities: [rarity] }));
	}, []);

	const setCategory = useCallback((category: ItemCategory) => {
		setFilterState((prev) => ({ ...prev, categories: [category] }));
	}, []);

	const toggleRarity = useCallback((rarity: Rarity) => {
		setFilterState((prev) => {
			const newRarities = prev.rarities.includes(rarity)
				? prev.rarities.filter((r) => r !== rarity)
				: [...prev.rarities, rarity];
			return { ...prev, rarities: newRarities };
		});
	}, []);

	const toggleCategory = useCallback((category: ItemCategory) => {
		setFilterState((prev) => {
			const newCategories = prev.categories.includes(category)
				? prev.categories.filter((c) => c !== category)
				: [...prev.categories, category];
			return { ...prev, categories: newCategories };
		});
	}, []);

	const setSort = useCallback((field: SortField, order: SortOrder) => {
		setSortState((prev) => ({ ...prev, sortField: field, sortOrder: order }));
	}, []);

	const resetFilters = useCallback(() => {
		setIsLoading(true);

		// Add a slight delay to allow visualization of loading, even though things lock up it looks more responsive
		setTimeout(() => {
			setFilterState(defaultFilterState);
			setSortState(defaultSortState);
			setIsLoading(false);
		}, 50);
	}, [setFilterState, setSortState]);

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
