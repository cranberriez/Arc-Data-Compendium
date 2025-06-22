// src/db/queries/getAggregate.ts
import { db } from "../drizzle"; // your Drizzle client
import { items, recipes, recipeLocks } from "../schema"; // adjust import paths as needed

export async function getAggregateCounts() {
	const [itemCountResult, recipeCountResult, lockCountResult] = await Promise.all([
		db.$count(items),
		db.$count(recipes),
		db.$count(recipeLocks),
	]);

	return {
		itemCount: Number(itemCountResult ?? 0),
		recipeCount: Number(recipeCountResult ?? 0),
		lockCount: Number(lockCountResult ?? 0),
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
