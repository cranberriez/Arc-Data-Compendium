import { db } from "@/db/drizzle";
import { getItemSources } from "@/db/utils/getSources";
import { items, weapons, weaponStats as weaponStatsTable } from "@/db/schema/items";
import { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

// Define types based on the Drizzle schema
export type ItemModel = InferSelectModel<typeof items>;
export type WeaponModel = InferSelectModel<typeof weapons>;
export type WeaponStatsModel = InferSelectModel<typeof weaponStatsTable>;

// Define the structure for recipe IO data
type RecipeIO = {
	recipeId: string;
	itemId: string;
	role: "input" | "output";
	qty: number;
};

// Define the structure for recipe data
type Recipe = {
	id: string;
	type: "recycling" | "crafting";
	hasRecipeItem: boolean;
	inRaid: boolean;
	createdAt: Date | null;
	updatedAt: Date | null;
	io: RecipeIO[];
};

// Define a type for the upgrade stats
type UpgradeStats = {
	upgradeItemId: string;
	upgradeItemLevel: number;
	statType: string;
	modifierType: string;
	value: number;
};

// Define a type for upgrades
type Upgrade = {
	itemId: string;
	level: number;
	description: string | null;
	stats?: UpgradeStats[];
};

// Define the structure for recycling sources based on actual structure from getItemSources
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

// Define the actual structure of the data returned by the database query
type DatabaseItem = ItemModel & {
	weapon: WeaponModel | null;
	weaponStats: WeaponStatsModel | null;
	upgrades: Upgrade[];
	recycling: {
		id: string;
		type: "recycling" | "crafting";
		hasRecipeItem: boolean;
		inRaid: boolean;
		createdAt: Date | null;
		updatedAt: Date | null;
		io: RecipeIO[];
	} | null;
};

// Define the flattened item type that will be returned by the API
// All properties are optional to avoid TypeScript errors
export type FlattenedItem = ItemModel & {
	weapon?: WeaponModel;
	weaponStats?: WeaponStatsModel;
	upgrades?: Upgrade[];
	recycling?: RecipeIO[];
	recyclingSources?: RecyclingSource[];
};

/**
 * Flattens a single item's data by handling null/undefined relations
 * and transforming nested structures into a cleaner format
 */
export async function flattenItemData(item: DatabaseItem): Promise<FlattenedItem | null> {
	if (!item) return null;

	// Destructure with proper typing
	const { weapon, weaponStats, upgrades, recycling, ...base } = item;

	// Get recycling sources for the item
	const recyclingSources = await getItemSources(base.id);

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
