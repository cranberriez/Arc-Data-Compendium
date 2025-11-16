import { useUIStore } from "@/stores";
import { UIStore } from "@/stores/types";
import { Rarity, ItemCategory } from "@/types";
import { SortField, SortOrder } from "@/utils/items";

// Hook for item filtering
export const useItemFilters = () => {
	const filters = useUIStore((state: UIStore) => state.itemFilters);
	const setFilters = useUIStore((state: UIStore) => state.setItemFilters);
	const resetFilters = useUIStore((state: UIStore) => state.resetItemFilters);

	// Helper functions for individual filter updates
	const setSearchQuery = (query: string) => setFilters({ searchQuery: query });
	const setRarities = (rarities: Rarity[]) => setFilters({ rarities });
	const setCategories = (categories: ItemCategory[]) => setFilters({ categories });
	const toggleRarity = (rarity: Rarity) => {
		const newRarities = filters.rarities.includes(rarity)
			? filters.rarities.filter((r: Rarity) => r !== rarity)
			: [...filters.rarities, rarity];
		setFilters({ rarities: newRarities });
	};
	const toggleCategory = (category: ItemCategory) => {
		const newCategories = filters.categories.includes(category)
			? filters.categories.filter((c: ItemCategory) => c !== category)
			: [...filters.categories, category];
		setFilters({ categories: newCategories });
	};
	const toggleRecyclable = () => setFilters({ showRecyclable: !filters.showRecyclable });
	const toggleCraftable = () => setFilters({ showCraftable: !filters.showCraftable });
	const toggleHasStats = () => setFilters({ showHasStats: !filters.showHasStats });

	return {
		filters,
		setSearchQuery,
		setRarities,
		setCategories,
		toggleRarity,
		toggleCategory,
		toggleRecyclable,
		toggleCraftable,
		toggleHasStats,
		resetFilters,
	};
};

// Hook for item sorting
export const useItemSort = () => {
	const sort = useUIStore((state: UIStore) => state.itemSort);
	const setSort = useUIStore((state: UIStore) => state.setItemSort);

	const setSortField = (sortField: SortField, sortOrder: SortOrder) => {
		setSort({ sortField, sortOrder });
	};

	return {
		sort,
		setSortField,
	};
};

// Hook for dialog state
export const useDialog = () => {
	const dialogOpen = useUIStore((state: UIStore) => state.dialogOpen);
	const dialogType = useUIStore((state: UIStore) => state.dialogType);
	const dialogData = useUIStore((state: UIStore) => state.dialogData);
	const dialogQueue = useUIStore((state: UIStore) => state.dialogQueue);
	const openDialog = useUIStore((state: UIStore) => state.openDialog);
	const closeDialog = useUIStore((state: UIStore) => state.closeDialog);
	const backDialog = useUIStore((state: UIStore) => state.backDialog);

	return {
		dialogOpen,
		dialogType,
		dialogData,
		dialogQueue,
		openDialog,
		closeDialog,
		backDialog,
	};
};

// Hook for search state
export const useSearch = () => {
	const searchOpen = useUIStore((state: UIStore) => state.searchOpen);
	const setSearchOpen = useUIStore((state: UIStore) => state.setSearchOpen);

	return {
		searchOpen,
		setSearchOpen,
	};
};
