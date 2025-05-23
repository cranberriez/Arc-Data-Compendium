import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Item } from "@/types/items/item";
import { Recipe } from "@/types/items/recipe";
import { Workbench } from "@/types/items/workbench";

// Import all JSON data files
import workbenchJson from "./workbenches/workbenchData.json";
import itemJson from "./items/itemData.json";
import recipeJson from "./recipes/recipeData.json";
import valuableJson from "./valuables/valuableData.json";

/**
 * Type mapping for different data categories
 */
export type DataTypes = {
	workbench: Workbench;
	item: Item;
	recipe: Recipe;
	valuable: Item;
};

/**
 * Data source mapping
 */
export const dataSources = {
	workbench: workbenchJson as unknown[],
	item: itemJson as unknown[],
	recipe: (recipeJson || []) as unknown[],
	valuable: valuableJson as unknown[],
};

/**
 * Type for a mapping function that converts JSON data to match a TypeScript schema
 */
export type DataMapper<T> = (jsonItem: Record<string, any>) => T;

/**
 * Default mappers for each data type
 */
export const defaultMappers: {
	[K in keyof DataTypes]?: DataMapper<DataTypes[K]>;
} = {
	item: (jsonItem) =>
		({
			...jsonItem,
			value: jsonItem.value ?? 0,
		} as Item),
	valuable: (jsonItem) =>
		({
			...jsonItem,
			category: "valuable",
			value: jsonItem.value ?? 100,
		} as Item),
	recipe: (jsonItem) =>
		({
			...jsonItem,
			craftTime: jsonItem.craftTime ?? 5,
			outputCount: jsonItem.outputCount ?? 1,
			unlockedByDefault: jsonItem.unlockedByDefault ?? false,
		} as Recipe),
	workbench: (jsonItem) =>
		({
			...jsonItem,
		} as Workbench),
};

/**
 * Processes icon strings to Lucide components
 */
function processIcon(item: Record<string, any>): Record<string, any> {
	const processedItem = { ...item };

	if (typeof item.icon === "string") {
		// Convert icon string to LucideIcon component
		const iconName = item.icon as keyof typeof LucideIcons;
		processedItem.icon = LucideIcons[iconName] as LucideIcon;

		if (!processedItem.icon) {
			console.warn(`Icon not found: ${item.icon} for item ${item.id}`);
			// Provide a fallback icon
			processedItem.icon = LucideIcons.HelpCircle;
		}
	}

	return processedItem;
}

/**
 * Generic function to load data from JSON
 * @param dataType The type of data to load
 * @param customMapper Optional custom mapper function
 * @returns The loaded data with proper TypeScript types
 */
export function loadData<T extends keyof DataTypes>(
	dataType: T,
	customMapper?: DataMapper<DataTypes[T]>
): DataTypes[T][] {
	const jsonData = dataSources[dataType];

	if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
		return [];
	}

	return jsonData.map((item) => {
		// Process the item with the custom mapper, default mapper, or just process icons
		const itemAsRecord = item as Record<string, any>;
		let processedItem = processIcon(itemAsRecord);

		if (customMapper) {
			processedItem = customMapper(processedItem);
		} else if (defaultMappers[dataType]) {
			processedItem = defaultMappers[dataType]!(processedItem);
		}

		return processedItem as DataTypes[T];
	});
}

/**
 * Pre-loaded data exports for direct use
 */
export const workbenches = loadData("workbench");
export const items = loadData("item");
export const recipes = loadData("recipe");
export const valuables = loadData("valuable");

/**
 * Loads data from an external JSON file
 * @param jsonPath Path to the JSON file
 * @param dataType The type of data being loaded
 * @param customMapper Optional custom mapper function
 * @returns Promise that resolves to the loaded data
 */
export async function loadDataFromFile<T extends keyof DataTypes>(
	jsonPath: string,
	dataType: T,
	customMapper?: DataMapper<DataTypes[T]>
): Promise<DataTypes[T][]> {
	try {
		const response = await fetch(jsonPath);
		if (!response.ok) {
			throw new Error(`Failed to load JSON data from ${jsonPath}: ${response.statusText}`);
		}

		const jsonData = await response.json();

		if (!jsonData || !Array.isArray(jsonData)) {
			return [];
		}

		return jsonData.map((item) => {
			// Process the item with the custom mapper, default mapper, or just process icons
			const itemAsRecord = item as Record<string, any>;
			let processedItem = processIcon(itemAsRecord);

			if (customMapper) {
				processedItem = customMapper(processedItem);
			} else if (defaultMappers[dataType]) {
				processedItem = defaultMappers[dataType]!(processedItem);
			}

			return processedItem as DataTypes[T];
		});
	} catch (error) {
		console.error(`Error loading JSON data from ${jsonPath}:`, error);
		return [];
	}
}
