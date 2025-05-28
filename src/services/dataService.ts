import { Item } from "@/types/items/item";
import { Recipe } from "@/types/items/recipe";
import { Workbench } from "@/types/items/workbench";

type DataType = "items" | "recipes" | "workbenches" | "valuables";

/**
 * Generic function to fetch data from the API
 * @param type The type of data to fetch
 * @param id Optional ID to fetch a specific item
 * @returns Promise that resolves to an array of items or a single item if ID is provided
 */
async function fetchData<T>(type: DataType, id?: string): Promise<T[] | T | null> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const endpoint = id ? `/api/data/${type}/${id}` : `/api/data/${type}`;
		const url = `${baseUrl}${endpoint}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600,
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
 * Fetches all valuables from the API
 * @returns Promise that resolves to an array of valuables
 */
export async function fetchValuables(): Promise<Item[]> {
	const result = await fetchData<Item>("valuables");
	return Array.isArray(result) ? result : [];
}

/**
 * Fetches a single valuable by ID from the API
 * @param id The ID of the valuable to fetch
 * @returns Promise that resolves to the valuable or null if not found
 */
export async function fetchValuableById(id: string): Promise<Item | null> {
	const result = await fetchData<Item>("valuables", id);
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

// For backward compatibility
export type DataTypes = {
	workbench: Workbench;
	item: Item;
	recipe: Recipe;
	valuable: Item;
};
