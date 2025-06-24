// src/db/queries/getAggregate.ts
import { db } from "../drizzle"; // your Drizzle client
import { items, quests, recipes, tierRequirements } from "../schema"; // adjust import paths as needed
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function getAggregateCounts() {
	const [
		itemCountResult,
		craftingRecipeCountResult,
		questCountResult,
		weaponCountResult,
		workbenchUpgradeCountResult,
	] = await Promise.all([
		db.$count(items),
		db.$count(recipes, eq(recipes.type, "crafting")),
		db.$count(quests),
		db.$count(items, eq(items.category, "weapon")),
		db
			.select({
				value: sql<number>`sum(${tierRequirements.count})`,
			})
			.from(tierRequirements),
	]);

	return {
		itemCount: Number(itemCountResult ?? 0),
		craftingRecipeCount: Number(craftingRecipeCountResult ?? 0),
		questCount: Number(questCountResult ?? 0),
		weaponCount: Number(weaponCountResult ?? 0),
		workbenchUpgradeCount: Number(workbenchUpgradeCountResult[0].value ?? 0),
	};
}

// This is a very basic version of the aggregation getter to be implented into the API, this should be expanded in the future
// TODO: Add more aggregation functions
// MORE IMPORTANT: These two may not be good as they dont take into account the users tracked state
// -- ALL required items for all quests
// -- All required items for all workbench upgrades
// LESS IMPORTANT:
// -- Locked Recipes
// -- Items in each category / rarity / maybe something useful?
//
