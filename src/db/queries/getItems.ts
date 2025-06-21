import { eq } from "drizzle-orm";
import { db } from "../drizzle";

/**
import { items, weapons, weaponStats, upgrade, upgradeStats, recipes } from "../schema";
import { eq, inArray } from "drizzle-orm";
import {
	Item,
	ItemBase,
	WeaponBase,
	WeaponStatsBase,
	UpgradeBase,
	UpgradeStatsBase,
	Recipe,
} from "@/types/schema";

export type GetItemsOptions = {
	id?: string;
};
*/

/**
 * Fetches items from the database
 * @param options - Optional parameters to filter items
 * @param options.id - Optional item ID to fetch a specific item
 * @returns Array of items (or empty array if none found)
 */
/**
 * Fetches items with all related data (weapon, stats, upgrades, recipes, quickUse, gear) in an optimized, batched way.
 *
 * - If an ID is provided, fetches only the matching item; otherwise, fetches all items.
 * - Batches DB calls for all related tables (weapons, stats, upgrades, recipes).
 * - Groups related data in memory by itemId for efficient assembly.
 *
 * @param options - Optional parameters to filter items
 * @param options.id - Optional item ID to fetch a specific item
 * @returns Array of items with all related data, or empty array if none found
 */

/**
export async function getItems(options?: GetItemsOptions): Promise<Item[]> {
	// Step 1: Fetch base item(s)
	let itemResults: ItemBase[];
	if (options?.id) {
		const item = await db.query.items.findFirst({ where: eq(items.id, options.id) });
		itemResults = item ? [item] : [];
	} else {
		itemResults = await db.query.items.findMany();
	}

	// Step 2: Early return if no items found
	if (itemResults.length === 0) return [];

	// Step 3: Collect all item IDs
	const itemIds = itemResults.map((i) => i.id);

	// Step 4: Batch fetch all weapons for these items
	const allWeapons = await db.query.weapons.findMany({ where: inArray(weapons.itemId, itemIds) });
	const weaponIds = allWeapons.map((w) => w.id);

	// Step 5: Batch fetch all weaponStats for these weapons
	const allWeaponStats = await db.query.weaponStats.findMany({
		where: inArray(weaponStats.weaponId, weaponIds),
	});

	// Step 6: Batch fetch all upgrades for these weapons
	const allUpgrades = await db.query.upgrade.findMany({
		where: inArray(upgrade.weaponId, weaponIds),
	});
	const upgradeIds = allUpgrades.map((u) => u.id);

	// Step 7: Batch fetch all upgradeStats for these upgrades
	const allUpgradeStats = await db.query.upgradeStats.findMany({
		where: inArray(upgradeStats.upgradeId, upgradeIds),
	});

	// Step 8: Batch fetch all recipes for these items (both crafting and recycling)
	const craftingRecipeIds = itemIds.map((id) => `recipe_${id}`);
	const recyclingRecipeIds = itemIds.map((id) => `recycle_${id}`);
	const allRecipeIds = [...craftingRecipeIds, ...recyclingRecipeIds];
	const allRecipes = await db.query.recipes.findMany({
		where: inArray(recipes.id, allRecipeIds),
	});

	// Step 9: Group all related data by itemId/weaponId/upgradeId
	const weaponsByItemId: Record<string, WeaponBase> = {};
	for (const w of allWeapons) weaponsByItemId[w.itemId] = w;

	const weaponStatsByWeaponId: Record<number, WeaponStatsBase> = {};
	for (const ws of allWeaponStats) weaponStatsByWeaponId[ws.weaponId] = ws;

	const upgradesByWeaponId: Record<number, UpgradeBase[]> = {};
	for (const u of allUpgrades) {
		if (!upgradesByWeaponId[u.weaponId]) upgradesByWeaponId[u.weaponId] = [];
		upgradesByWeaponId[u.weaponId].push(u);
	}

	const upgradeStatsByUpgradeId: Record<number, UpgradeStatsBase[]> = {};
	for (const us of allUpgradeStats) {
		if (!upgradeStatsByUpgradeId[us.upgradeId]) upgradeStatsByUpgradeId[us.upgradeId] = [];
		upgradeStatsByUpgradeId[us.upgradeId].push(us);
	}

	const recipesById: Record<string, Recipe> = {};
	for (const r of allRecipes) recipesById[r.id] = r as unknown as Recipe; // Cast for shape compatibility

	// Step 10: Assemble the results by attaching grouped related data to each item
	const itemsWithDetails: Item[] = itemResults.map((item) => {
		const weapon = weaponsByItemId[item.id];
		const weaponStats = weapon ? weaponStatsByWeaponId[weapon.id] : undefined;
		const upgrades =
			weapon && upgradesByWeaponId[weapon.id]
				? upgradesByWeaponId[weapon.id].map((upg) => ({
						...upg,
						stats: upgradeStatsByUpgradeId[upg.id] || [],
				  }))
				: undefined;
		const recycling = recipesById[`recycle_${item.id}`] || undefined;
		const recipe = recipesById[`recipe_${item.id}`] || undefined;

		return {
			...item,
			weapon,
			weaponStats,
			upgrades,
			recycling,
			recipe,
			quickUse: item.quickUse ?? null,
			gear: item.gear ?? null,
		};
	});

	// Step 11: Return the fully assembled items array
	return itemsWithDetails;
}
*/

export const getItems = ({ id }: { id?: string } = {}) => {
	return db.query.items.findMany({
		where: id ? eq(items.id, id) : undefined,
		with: {
			weapon: {
				columns: { id: false, itemId: false },
				with: {
					weaponStats: true,
					upgrades: { with: { upgradeStats: true } },
				},
			},
			recipe: { with: { io: true, locks: true } },
			recycling: { with: { io: true } },
		},
	});
};

export const getWeapons = ({ id }: { id?: string } = {}) => {
	return db.query.items.findMany({
		where: id ? eq(items.id, id) : eq(items.category, "weapon"),
		with: {
			weapon: {
				columns: { id: false, itemId: false },
				with: {
					weaponStats: true,
					upgrades: { with: { upgradeStats: true } },
				},
			},
			recipe: { with: { io: true, locks: true } },
			recycling: { with: { io: true } },
		},
	});
};
