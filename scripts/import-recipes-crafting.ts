import { readFile } from "fs/promises";
import path from "path";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../src/db/drizzle";
import { items, recipes, recipeItems, ioEnum } from "../src/db/schema";
import { tiers, workbenchRecipes } from "../src/db/schema/workbenches";

interface ScrapedRecipeDef {
	result?: Record<string, number> | null;
	ingredients?: Record<string, number> | null;
	workbenches?: Record<string, number> | null; // workbenchId -> tier, or inventory:1
	blueprint?: boolean;
}

interface ScrapedItem {
	id: string;
	recipe?: ScrapedRecipeDef[] | ScrapedRecipeDef | null;
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const FILES = [
	"arc_raiders_items_enriched.json",
	"augment_items_enriched.json",
	"grenade_items_enriched.json",
	"healing_items_enriched.json",
	"quick_use_items_enriched.json",
	"trap_items_enriched.json",
	"shields.json",
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

function normalizeRecipeArray(r?: ScrapedItem["recipe"]): ScrapedRecipeDef[] {
	if (!r) return [];
	if (Array.isArray(r)) return r.filter(Boolean);
	return [r];
}

function extractResultId(
	def: ScrapedRecipeDef,
	fallbackId: string
): { id: string; qty: number } | null {
	const res = def.result ?? null;
	if (!res) return null;
	const entries = Object.entries(res).filter(([k, v]) => k && typeof v === "number");
	if (entries.length === 0) return null;
	const [id, qty] = entries[0];
	return { id: id || fallbackId, qty: (qty as number) ?? 1 };
}

async function upsertCraftingRecipeForItem(itemId: string, def: ScrapedRecipeDef) {
	const result = extractResultId(def, itemId);
	const ingredients = def.ingredients ?? {};
	const workbenches = def.workbenches ?? {};
	const inRaid = Object.prototype.hasOwnProperty.call(workbenches, "inventory");
	const isBlueprintLocked = !!def.blueprint;

	// Validate items exist (input + output)
	const inputIds = Object.keys(ingredients || {});
	const allIds = [...new Set([itemId, ...(result ? [result.id] : []), ...inputIds])];
	const existing = await ensureItemsExist(allIds);
	if (!existing.has(itemId)) {
		console.warn(`Skip recipe for ${itemId}: item not found`);
		return { created: false, updated: false, skipped: true } as const;
	}
	if (result && !existing.has(result.id)) {
		console.warn(`Skip recipe for ${itemId}: result item ${result.id} not found`);
		return { created: false, updated: false, skipped: true } as const;
	}
	const missingInputs = inputIds.filter((id) => !existing.has(id));
	if (missingInputs.length) {
		console.warn(`Skip recipe for ${itemId}: missing inputs ${missingInputs.join(", ")}`);
		return { created: false, updated: false, skipped: true } as const;
	}

	// Recipe id format
	const outputId = result ? result.id : itemId;
	const recipeId = `recipe_${outputId}`;

	// Upsert recipe
	const existingRecipe = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existingRecipe.length === 0) {
		await db
			.insert(recipes)
			.values({ id: recipeId, type: "crafting", isBlueprintLocked, inRaid });
	} else {
		await db
			.update(recipes)
			.set({ type: "crafting", isBlueprintLocked, inRaid })
			.where(eq(recipes.id, recipeId));
	}

	// Replace IO mapping
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	const ioValues = [
		// inputs
		...Object.entries(ingredients).map(([inputId, qty]) => ({
			recipeId,
			itemId: inputId,
			role: "input" as (typeof ioEnum.enumValues)[number],
			qty: typeof qty === "number" ? qty : 1,
		})),
		// outputs
		{
			recipeId,
			itemId: outputId,
			role: "output" as (typeof ioEnum.enumValues)[number],
			qty: result?.qty ?? 1,
		},
	];
	await db.insert(recipeItems).values(ioValues);

	// Point the crafted output item to this recipe via items.recipeId
	await db.update(items).set({ recipeId }).where(eq(items.id, outputId));

	// Upsert workbench_recipes mapping
	// Clear existing rows for this recipe to avoid duplicates
	await db.delete(workbenchRecipes).where(eq(workbenchRecipes.recipeId, recipeId));

	for (const [wbId, tier] of Object.entries(workbenches)) {
		if (wbId === "inventory") continue; // handled via inRaid

		let correctedWBID = wbId;
		if (wbId === "workbench_i") correctedWBID = "workbench";
		else if (wbId === "gear_bench_i") correctedWBID = "gear_bench";
		else if (wbId === "explosive_station") correctedWBID = "explosives_station";

		const tierNum = typeof tier === "number" ? tier : parseInt(String(tier), 10);
		if (!Number.isFinite(tierNum)) continue;
		// Ensure the referenced workbench tier exists to satisfy FK
		const tierRow = await db
			.select({ t: tiers.tier })
			.from(tiers)
			.where(and(eq(tiers.workbenchId, correctedWBID), eq(tiers.tier, tierNum)));
		if (tierRow.length === 0) {
			console.warn(
				`Skip linking recipe ${recipeId} to ${correctedWBID} tier ${tierNum}: tier not found (seed workbench tiers first)`
			);
			continue;
		}
		await db
			.insert(workbenchRecipes)
			.values({ workbenchId: correctedWBID, workbenchTier: tierNum, recipeId });
	}

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
			if (!rec?.id) continue;
			const defs = normalizeRecipeArray(rec.recipe);
			for (const def of defs) {
				if (!def || (!def.ingredients && !def.result && !def.workbenches)) continue;
				try {
					const res = await upsertCraftingRecipeForItem(rec.id, def);
					if (res.skipped) skipped++;
					else if (res.created) created++;
					else if (res.updated) updated++;
				} catch (e) {
					console.error(`Failed crafting for ${rec.id}:`, e);
					skipped++;
				}
			}
		}
	}

	console.log(`Crafting recipes - created: ${created}, updated: ${updated}, skipped: ${skipped}`);
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
