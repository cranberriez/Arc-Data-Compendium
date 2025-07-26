"use server";

import { Item, Weapon, Quest, Recipe, Workbench } from "@/types";
import { getItems, getWeapons } from "@/db/queries";
import {
	getQuestIds,
	getQuests,
	getRecipes,
	getWorkbenches,
	getWorkbenchIds,
	getFirstQuestId,
} from "@/db/queries";

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
export async function fetchWeapons(): Promise<Weapon[]> {
	const weapons = await getWeapons();
	return Array.isArray(weapons) ? weapons : [];
}

// Fetch a single weapon by ID
export async function fetchWeaponById(id: string): Promise<Weapon | null> {
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
 * Fetches all workbench IDs from the API
 * @returns Promise that resolves to an array of workbench IDs
 */
export async function fetchWorkbenchIds(): Promise<string[]> {
	const workbenchIds = await getWorkbenchIds();
	return Array.isArray(workbenchIds) ? workbenchIds : [];
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

/**
 * Fetches all quest IDs from the API
 * @returns Promise that resolves to an array of quest IDs
 */
export async function fetchQuestIds(): Promise<string[]> {
	const questIds = await getQuestIds();
	return Array.isArray(questIds) ? questIds : [];
}

/**
 * Fetches the first quest ID from the API
 * @returns Promise that resolves to the first quest ID
 */
export async function fetchFirstQuestId(): Promise<string> {
	return await getFirstQuestId();
}
