import { Item } from "@/types";
import { SortOptions, SortOrder } from "./types";

/**
 * Defines the order of rarity values for sorting purposes
 */
const rarityOrder = {
	common: 1,
	uncommon: 2,
	rare: 3,
	epic: 4,
	legendary: 5,
};

/**
 * Compares two items by name (alphabetically)
 * @param a First item
 * @param b Second item
 * @param sortOrder Sort direction (asc or desc)
 * @returns Comparison result (-1, 0, or 1)
 */
const compareByName = (a: Item, b: Item, sortOrder: SortOrder): number => {
	const result = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	return sortOrder === "desc" ? -result : result;
};

/**
 * Compares two items by rarity
 * @param a First item
 * @param b Second item
 * @param sortOrder Sort direction (asc or desc)
 * @returns Comparison result (-1, 0, or 1)
 */
const compareByRarity = (a: Item, b: Item, sortOrder: SortOrder): number => {
	const aRarity = rarityOrder[a.rarity];
	const bRarity = rarityOrder[b.rarity];
	const result = aRarity - bRarity;
	return sortOrder === "desc" ? -result : result;
};

/**
 * Compares two items by category (alphabetically)
 * @param a First item
 * @param b Second item
 * @param sortOrder Sort direction (asc or desc)
 * @returns Comparison result (-1, 0, or 1)
 */
const compareByCategory = (a: Item, b: Item, sortOrder: SortOrder): number => {
	const result = a.category.localeCompare(b.category);
	return sortOrder === "desc" ? -result : result;
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use the new comparison functions instead
 */
export const sortByRarityThenName =
	() =>
	(a: Item, b: Item): number => {
		const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
		if (rarityCompare !== 0) return rarityCompare;
		return a.name.localeCompare(b.name);
	};

/**
 * Sorts an array of items based on specified sort field and order with cascading sort logic:
 * - Name sorting: Sort only by name (alphabetical)
 * - Rarity sorting: Sort by rarity, then by name
 * - Category sorting: Sort by category, then by rarity, then by name
 * - Default sorting: When sortField is "none" or undefined, use rarity sorting
 *
 * @param items Array of items to sort
 * @param sortOptions Sort options containing field and order
 * @returns New sorted array of items
 */
export const sortItems = (items: Item[], sortOptions: SortOptions): Item[] => {
	// Use ascending order as default when sortOrder is "none" or undefined
	const effectiveSortOrder: "asc" | "desc" =
		sortOptions.sortOrder === "none" || !sortOptions.sortOrder ? "asc" : sortOptions.sortOrder;

	return [...items].sort((a, b) => {
		// Handle each sort field with cascading logic
		switch (sortOptions.sortField) {
			case "name":
				// Name sorting: Sort only by name
				return compareByName(a, b, effectiveSortOrder);

			case "rarity":
				// Rarity sorting: Sort by rarity, then by name
				const rarityResult = compareByRarity(a, b, effectiveSortOrder);
				return rarityResult !== 0 ? rarityResult : compareByName(a, b, "asc");

			case "category":
				// Category sorting: Sort by category, then by rarity, then by name
				const categoryResult = compareByCategory(a, b, effectiveSortOrder);
				if (categoryResult !== 0) return categoryResult;

				const rarityInCategoryResult = compareByRarity(a, b, "asc");
				return rarityInCategoryResult !== 0
					? rarityInCategoryResult
					: compareByName(a, b, "asc");

			default:
				// Default sorting: Sort by rarity, then by name
				const defaultRarityResult = compareByRarity(a, b, "asc");
				return defaultRarityResult !== 0 ? defaultRarityResult : compareByName(a, b, "asc");
		}
	});
};
