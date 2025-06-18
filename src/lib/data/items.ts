import { db } from "@/db/drizzle";
import { getItemSources } from "@/db/utils/getSources";
import { items } from "@/db/schema/items";
import { eq } from "drizzle-orm";
import {
	ItemModel,
	WeaponModel,
	WeaponStatsModel,
	UpgradeModel,
	UpgradeStatsModel,
	RecipeModel,
	RecipeIO,
	EnhancedRecipe,
	EnhancedItem
} from "@/types/schema";

// Define the structure for recycling sources based on actual structure from getItemSources
// This matches what getItemSources returns
type RecyclingSource = {
	recipeId: string;
	recipe: {
		id: string;
		type: "recycling" | "crafting";
		hasRecipeItem: boolean;
		inRaid: boolean;
		createdAt: Date | null;
		updatedAt: Date | null;
	};
	inputs: RecipeIO[];
	outputs: RecipeIO[];
};

// Helper function to convert RecyclingSource to EnhancedRecipe
function convertToEnhancedRecipe(source: RecyclingSource): EnhancedRecipe {
	return {
		...source.recipe,
		inputs: source.inputs,
		outputs: source.outputs
	};
};

// Define the actual structure of the data returned by the database query
type DatabaseItem = ItemModel & {
	weapon: WeaponModel | null;
	weaponStats: WeaponStatsModel | null;
	upgrades: (UpgradeModel & { stats: UpgradeStatsModel[] })[];
	recycling: RecipeModel & {
		io: RecipeIO[];
	} | null;
};

// Use the EnhancedItem type from schema.ts as our FlattenedItem
export type FlattenedItem = EnhancedItem;

/**
 * Flattens a single item's data by handling null/undefined relations
 * and transforming nested structures into a cleaner format
 */
export async function flattenItemData(item: DatabaseItem): Promise<FlattenedItem | null> {
	if (!item) return null;

	// Destructure with proper typing
	const { weapon, weaponStats, upgrades, recycling, ...base } = item;

	// Get recycling sources for the item
	const rawRecyclingSources = await getItemSources(base.id);

	// Convert recycling sources to EnhancedRecipe[] format
	const recyclingSources = rawRecyclingSources.map(convertToEnhancedRecipe);

	// Build the flattened item with proper conditional properties
	const result = {
		...base,
	} as FlattenedItem;

	// Add optional properties only if they exist
	if (weapon) result.weapon = weapon;
	if (weaponStats) result.weaponStats = weaponStats;
	if (upgrades && upgrades.length > 0) result.upgrades = upgrades;
	// Use proper typing for recycling data
	if (recycling?.io) result.recycling = recycling.io;
	if (recyclingSources && recyclingSources.length > 0) result.recyclingSources = recyclingSources;

	return result;
}

/**
 * Flattens an array of items' data
 */
export async function flattenItemsData(items: DatabaseItem[]): Promise<FlattenedItem[]> {
	const flattened = await Promise.all(items.map(async (item) => await flattenItemData(item)));
	// Filter out null values
	return flattened.filter((item): item is FlattenedItem => item !== null);
}

/**
 * Gets items with optional filters
 * @param options Optional filters and query options
 */
export async function getItems(options?: {
	id?: string;
	category?: string;
}): Promise<FlattenedItem[] | FlattenedItem | null> {
	try {
		// Build the where clause based on provided options
		const whereClause = (items: any, { eq }: any) => {
			const conditions = [];

			if (options?.id) {
				conditions.push(eq(items.id, options.id));
			}

			if (options?.category) {
				// Use type assertion to handle the enum type
				conditions.push(eq(items.category, options.category as any));
			}

			// If no conditions, return undefined (no filter)
			if (conditions.length === 0) {
				return undefined;
			}

			// If only one condition, return it directly
			if (conditions.length === 1) {
				return conditions[0];
			}

			// Otherwise, return an AND of all conditions
			// Note: This would need to be adjusted if you need OR conditions
			return { AND: conditions };
		};

		// Fetch items with their relations
		const result = await db.query.items.findMany({
			where: whereClause,
			with: {
				weapon: true,
				weaponStats: true,
				upgrades: {
					with: {
						stats: true,
					},
				},
				recycling: {
					with: {
						io: true,
					},
				},
			},
		});

		// If looking for a specific item by ID, return the first result or null
		if (options?.id) {
			const item = result[0];
			// Use type assertion to handle the database result type
			return item ? await flattenItemData(item as DatabaseItem) : null;
		}

		// Otherwise, return all results
		// Use type assertion to handle the database result type
		return await flattenItemsData(result as DatabaseItem[]);
	} catch (error) {
		console.error("Error fetching items:", error);
		throw error;
	}
}
