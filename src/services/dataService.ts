import { Item } from "@/types/items/item";
import { Recipe } from "@/types/items/recipe";
import { Workbench } from "@/types/items/workbench";

export type DataTypes = {
	workbench: Workbench;
	item: Item;
	recipe: Recipe;
	valuable: Item;
};

/**
 * Fetches items data from the API
 */
export async function fetchItems(): Promise<Item[]> {
	try {
		// In server components, we need absolute URLs
		// Use process.env.NEXT_PUBLIC_BASE_URL or a default for local development
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const response = await fetch(`${baseUrl}/api/items`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600,
			},
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch items: ${response.statusText}`);
		}
		const data = await response.json();
		return data.map((item: Record<string, any>) => {
			return {
				...item,
				value: item.value ?? 0,
			} as Item;
		});
	} catch (error) {
		console.error("Error fetching items:", error);
		return [];
	}
}

/**
 * Fetches valuables data from the API
 */
export async function fetchValuables(): Promise<Item[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const response = await fetch(`${baseUrl}/api/valuables`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600,
			},
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch valuables: ${response.statusText}`);
		}
		const data = await response.json();
		return data.map((item: Record<string, any>) => {
			return {
				...item,
				category: "valuable",
				value: item.value ?? 100,
			} as Item;
		});
	} catch (error) {
		console.error("Error fetching valuables:", error);
		return [];
	}
}

/**
 * Fetches recipes data from the API
 */
export async function fetchRecipes(): Promise<Recipe[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const response = await fetch(`${baseUrl}/api/recipes`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600,
			},
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch recipes: ${response.statusText}`);
		}
		const data = await response.json();
		return data.map((item: Record<string, any>) => {
			return {
				...item,
				craftTime: item.craftTime ?? 5,
				outputCount: item.outputCount ?? 1,
				unlockedByDefault: item.unlockedByDefault ?? false,
			} as Recipe;
		});
	} catch (error) {
		console.error("Error fetching recipes:", error);
		return [];
	}
}

/**
 * Fetches workbenches data from the API
 */
export async function fetchWorkbenches(): Promise<Workbench[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const response = await fetch(`${baseUrl}/api/workbenches`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600,
			},
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch workbenches: ${response.statusText}`);
		}
		const data = await response.json();
		return data.map((item: Record<string, any>) => {
			return {
				...item,
			} as Workbench;
		});
	} catch (error) {
		console.error("Error fetching workbenches:", error);
		return [];
	}
}

/**
 * Generic function to fetch data from API
 */
export async function fetchData<T extends keyof DataTypes>(dataType: T): Promise<DataTypes[T][]> {
	switch (dataType) {
		case "item":
			return fetchItems() as Promise<DataTypes[T][]>;
		case "valuable":
			return fetchValuables() as Promise<DataTypes[T][]>;
		case "recipe":
			return fetchRecipes() as Promise<DataTypes[T][]>;
		case "workbench":
			return fetchWorkbenches() as Promise<DataTypes[T][]>;
		default:
			console.error(`Unknown data type: ${dataType}`);
			return [] as unknown as DataTypes[T][];
	}
}
