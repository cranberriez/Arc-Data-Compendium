"use server";

import { Item, Quest, Recipe, Workbench, Weapon } from "@/types";
import { isWeapon } from "@/utils/items/subTypeUtils";
import { getItems, getWeapons } from "@/db/queries/getItems";
import { getQuests, getRecipes, getWorkbenches } from "@/db/queries";

type DataType = "items" | "recipes" | "workbenches" | "quests";

/**
 * Generic function to fetch data from the API
 * @param type The type of data to fetch
 * @param id Optional ID to fetch a specific item
 * @returns Promise that resolves to an array of items or a single item if ID is provided
 */
async function fetchData<T>(type: DataType, id?: string): Promise<T[] | T | null> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

// Fetch all items
export async function fetchItems(): Promise<Item[]> {
	const items = await getItems();
	return Array.isArray(items) ? items : [];
}

// Fetch a single item by ID
export async function fetchItemById(id: string): Promise<Item | null> {
	const items = await getItems({ id });
	if (Array.isArray(items) && items.length > 0) {
		return items[0];
	}
	return null;
}

// Fetch all weapons
export async function fetchWeapons(): Promise<Item[]> {
	const weapons = await getWeapons();
	return Array.isArray(weapons) ? weapons : [];
}

// Fetch a single weapon by ID
export async function fetchWeaponById(id: string): Promise<Item | null> {
	const weapons = await getWeapons({ id });
	if (Array.isArray(weapons) && weapons.length > 0) {
		return weapons[0];
	}
	return null;
}

/**
 * Fetches all recipes from the API
 * @returns Promise that resolves to an array of recipes
 */
export async function fetchRecipes(): Promise<Recipe[]> {
	const recipes = await getRecipes();
	return Array.isArray(recipes) ? recipes : [];
}

/**
 * Fetches a single recipe by ID from the API
 * @param id The ID of the recipe to fetch
 * @returns Promise that resolves to the recipe or null if not found
 */
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
	const recipes = await getRecipes({ id });
	if (Array.isArray(recipes) && recipes.length > 0) {
		return recipes[0];
	}
	return null;
}

/**
 * Fetches all workbenches from the API
 * @returns Promise that resolves to an array of workbenches
 */
export async function fetchWorkbenches(): Promise<Workbench[]> {
	const workbenches = await getWorkbenches();
	return Array.isArray(workbenches) ? workbenches : [];
}

/**
 * Fetches a single workbench by ID from the API
 * @param id The ID of the workbench to fetch
 * @returns Promise that resolves to the workbench or null if not found
 */
export async function fetchWorkbenchById(id: string): Promise<Workbench | null> {
	const workbenches = await getWorkbenches({ id });
	if (Array.isArray(workbenches) && workbenches.length > 0) {
		return workbenches[0];
	}
	return null;
}

/**
 * Fetches all quests from the API
 * @returns Promise that resolves to an array of quests
 */
export async function fetchQuests(): Promise<Quest[]> {
	const quests = await getQuests();
	return Array.isArray(quests) ? quests : [];
}

/**
 * Fetches a single quest by ID from the API
 * @param id The ID of the quest to fetch
 * @returns Promise that resolves to the quest or null if not found
 */
export async function fetchQuestById(id: string): Promise<Quest | null> {
	const quests = await getQuests({ id });
	if (Array.isArray(quests) && quests.length > 0) {
		return quests[0];
	}
	return null;
}
