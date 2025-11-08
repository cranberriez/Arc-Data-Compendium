import { readFile } from "fs/promises";
import path from "path";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../src/db/drizzle";
import { items, recipes, recipeItems, ioEnum } from "../src/db/schema";

interface ScrapedItem {
	id: string;
	recycling?: Record<string, number> | null; // output item id -> qty
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const FILES = [
	"arc_raiders_items_enriched.json",
	"augment_items_enriched.json",
	"grenade_items_enriched.json",
	"healing_items_enriched.json",
	"quick_use_items_enriched.json",
	"trap_items_enriched.json",
];

async function readJson(filePath: string) {
	const raw = await readFile(filePath, "utf-8");
	return JSON.parse(raw) as ScrapedItem[];
}

async function ensureItemsExist(ids: string[]): Promise<Set<string>> {
	if (ids.length === 0) return new Set();
	const rows = await db.select({ id: items.id }).from(items).where(inArray(items.id, ids));
	return new Set(rows.map((r) => r.id));
}

async function upsertRecyclingRecipe(inputItemId: string, outputs: Record<string, number>) {
	const recipeId = `recycle_${inputItemId}`;

	// Ensure input and output items exist
	const outputIds = Object.keys(outputs);
	const existing = await ensureItemsExist([inputItemId, ...outputIds]);
	if (!existing.has(inputItemId)) {
		console.warn(`Skip recycle for ${inputItemId}: input item not found in DB`);
		return { created: false, updated: false, skipped: true } as const;
	}
	const missingOutputs = outputIds.filter((id) => !existing.has(id));
	if (missingOutputs.length > 0) {
		console.warn(
			`Skip recycle for ${inputItemId}: missing outputs ${missingOutputs.join(", ")}`
		);
		return { created: false, updated: false, skipped: true } as const;
	}

	const existingRecipe = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existingRecipe.length === 0) {
		await db
			.insert(recipes)
			.values({ id: recipeId, type: "recycling", inRaid: false, isBlueprintLocked: false });
	}

	// Replace recipe IO mapping (safe due to cascade PK)
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));

	const values = [
		{
			recipeId,
			itemId: inputItemId,
			role: "input" as (typeof ioEnum.enumValues)[number],
			qty: 1,
		},
		...Object.entries(outputs).map(([itemId, qty]) => ({
			recipeId,
			itemId,
			role: "output" as (typeof ioEnum.enumValues)[number],
			qty: typeof qty === "number" ? qty : 1,
		})),
	];

	await db.insert(recipeItems).values(values);
	return {
		created: existingRecipe.length === 0,
		updated: existingRecipe.length > 0,
		skipped: false,
	} as const;
}

async function main() {
	let created = 0;
	let updated = 0;
	let skipped = 0;

	for (const file of FILES) {
		const filePath = path.join(DATA_DIR, file);
		let list: ScrapedItem[] = [];
		try {
			list = await readJson(filePath);
		} catch (e) {
			console.error(`Failed to read ${file}:`, e);
			continue;
		}

		for (const rec of list) {
			if (!rec?.id || !rec.recycling || Object.keys(rec.recycling).length === 0) continue;
			try {
				const res = await upsertRecyclingRecipe(rec.id, rec.recycling);
				if (res.skipped) skipped++;
				else if (res.created) created++;
				else if (res.updated) updated++;
			} catch (e) {
				console.error(`Failed recycling for ${rec.id}:`, e);
				skipped++;
			}
		}
	}

	console.log(
		`Recycling recipes - created: ${created}, updated: ${updated}, skipped: ${skipped}`
	);
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
