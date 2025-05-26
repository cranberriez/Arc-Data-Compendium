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
import { applyItemFilters, sortItems } from "@/utils/items";

import { Item } from "@/types";
import { addSources, composeProcessors, processItems } from "@/data/items/itemPreprocessor";
import { fetchItems, fetchValuables } from "@/services/dataService";

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
	isLoading: boolean;
	error: string | null;
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
	const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortOrder, setSortOrder] = useState<SortOrder>("none");

	// Memoize the current items to prevent recalculation
	const currentItems = useMemo(() => allItems, [allItems]);

	const filteredItems = useMemo(() => {
		const filtered = applyItemFilters(currentItems, {
			searchQuery: filterState.searchQuery,
			rarities: filterState.rarities,
			categories: filterState.categories,
		});

		return sortItems(filtered, sortField, sortOrder);
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
			sortField,
			sortOrder,
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
