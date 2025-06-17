import { Item } from "@/types";
import { Quest } from "@/types";
import { Recipe } from "@/types";
import { Workbench } from "@/types";

import itemsData from "@/data/items/itemData.build.json";
import recipesData from "@/data/recipes/recipeData.json";
import workbenchesData from "@/data/workbenches/workbenchData.json";
import questsData from "@/data/quests/questData.json";
import { Weapon } from "@/types";
import { isWeapon } from "@/data/items/subTypeUtils";

type DataType = "items" | "recipes" | "workbenches" | "quests";

const dataMap: Record<DataType, any> = {
	items: itemsData,
	recipes: recipesData,
	workbenches: workbenchesData,
	quests: questsData,
};

/**
 * Generic function to fetch data from the API
 * @param type The type of data to fetch
 * @param id Optional ID to fetch a specific item
 * @returns Promise that resolves to an array of items or a single item if ID is provided
 */
async function fetchData<T>(
	type: DataType,
	id?: string,
	filterFn?: (item: any) => boolean
): Promise<T[] | T | null> {
	// Server-side: use imported data directly
	// if (typeof window === "undefined") {
	// 	let allData = dataMap[type] as T[];
	// 	if (!allData) return null;
	// 	if (id) {
	// 		return allData.find((item: any) => item.id === id) ?? null;
	// 	}
	// 	if (filterFn) {
	// 		allData = allData.filter(filterFn);
	// 	}
	// 	return allData;
	// }

	// Client-side: fetch from API
	try {
		const isServer = typeof window === "undefined";
		const baseUrl = isServer ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" : "";

		const endpoint = id ? `${baseUrl}/api/data/${type}/${id}` : `${baseUrl}/api/data/${type}`;

		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
			},
		});

		if (!response.ok) {
			// If we're trying to fetch a single item and it's not found, return null
			if (id && response.status === 404) {
				return null;
			}
			throw new Error(
				`Failed to fetch ${type}${id ? ` with ID ${id}` : ""}: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error(`Error fetching ${type}${id ? ` with ID ${id}` : ""}:`, error);
		// Return appropriate default based on whether we're fetching a single item or a list
		// The public API now handles this, but keeping for backward compatibility
		return id ? null : [];
	}
}

/**
 * Fetches all items from the API
 * @returns Promise that resolves to an array of items
 */
export async function fetchItems(): Promise<Item[]> {
	const result = await fetchData<Item>("items");
	return Array.isArray(result) ? result : [];
}

/**
 * Fetches a single item by ID from the API
 * @param id The ID of the item to fetch
 * @returns Promise that resolves to the item or null if not found
 */
export async function fetchItemById(id: string): Promise<Item | null> {
	const result = await fetchData<Item>("items", id);
	return result && !Array.isArray(result) ? result : null;
}

/**
 * Fetches all recipes from the API
 * @returns Promise that resolves to an array of recipes
 */
export async function fetchRecipes(): Promise<Recipe[]> {
	const result = await fetchData<Recipe>("recipes");
	return Array.isArray(result) ? result : [];
}

/**
 * Fetches a single recipe by ID from the API
 * @param id The ID of the recipe to fetch
 * @returns Promise that resolves to the recipe or null if not found
 */
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
	const result = await fetchData<Recipe>("recipes", id);
	return result && !Array.isArray(result) ? result : null;
}

/**
 * Fetches all workbenches from the API
 * @returns Promise that resolves to an array of workbenches
 */
export async function fetchWorkbenches(): Promise<Workbench[]> {
	const result = await fetchData<Workbench>("workbenches");
	return Array.isArray(result) ? result : [];
}

/**
 * Fetches a single workbench by ID from the API
 * @param id The ID of the workbench to fetch
 * @returns Promise that resolves to the workbench or null if not found
 */
export async function fetchWorkbenchById(id: string): Promise<Workbench | null> {
	const result = await fetchData<Workbench>("workbenches", id);
	return result && !Array.isArray(result) ? result : null;
}

/**
 * Fetches all quests from the API
 * @returns Promise that resolves to an array of quests
 */
export async function fetchQuests(): Promise<Quest[]> {
	const result = await fetchData<Quest>("quests");
	return Array.isArray(result) ? result : [];
}

/**
 * Fetches a single quest by ID from the API
 * @param id The ID of the quest to fetch
 * @returns Promise that resolves to the quest or null if not found
 */
export async function fetchQuestById(id: string): Promise<Quest | null> {
	const result = await fetchData<Quest>("quests", id);
	return result && !Array.isArray(result) ? result : null;
}

/**
 * Fetches all weapons from the API
 * @returns Promise that resolves to an array of weapons
 */
export async function fetchWeapons(): Promise<Weapon[]> {
	const result = await fetchData<Item>("items");
	if (!Array.isArray(result)) return [];
	return result.filter(isWeapon) as Weapon[];
}

/**
 * Fetches a single weapon by ID from the API
 * @param id The ID of the weapon to fetch
 * @returns Promise that resolves to the weapon or null if not found
 */
export async function fetchWeaponById(id: string): Promise<Weapon | null> {
	const result = await fetchData<Item>("items", id);
	return result && !Array.isArray(result) && isWeapon(result) ? result : null;
}

// For backward compatibility
export type DataTypes = {
	workbench: Workbench;
	item: Item;
	recipe: Recipe;
	quest: Quest;
};
