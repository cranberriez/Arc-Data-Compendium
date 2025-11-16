import { readFile } from "fs/promises";
import path from "path";
import { db } from "../src/db/drizzle";
import { items, recipes, recipeItems, weapons } from "../src/db/schema";
import { eq } from "drizzle-orm";
import type { Rarity } from "../src/db/schema/enums";
import { ensureCurrentVersionId } from "./version";

// Input shapes from scraped JSON
interface ScrapedMod {
	id: string;
	name: string;
	description?: string;
	caption?: string;
	image?: string;
	rarity?: string;
	weight?: number;
	stack_size?: number;
	sell_price?: number;
	found_in?: string[];
	recipe?: Array<{
		result: Record<string, number>;
		ingredients?: Record<string, number>;
		workbenches?: Record<string, number>;
		blueprint?: boolean;
	}>;
	recycling?: Record<string, number>;
	stat_modifiers?: Record<string, number>;
	compatible_weapons?: string[];
	category_icon?: string; // not used here
}

// Metrics mapping types
type MappingEntry = {
	key_raw: string;
	key_slug: string;
	normalized: string;
	kind: "additive" | "multiplicative";
	unit: "percent" | "absolute";
	sign: "positive" | "negative";
};

type Metrics = {
	mods: MappingEntry[];
};

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const MODS_FILE = path.join(DATA_DIR, "modification_items_enriched.json");
const METRICS_FILE = path.join(DATA_DIR, "stat_mapping_metrics.json");

const rarityMap = new Map<string, Rarity>([
	["common", "common"],
	["uncommon", "uncommon"],
	["rare", "rare"],
	["epic", "epic"],
	["legendary", "legendary"],
]);

function normalizeRarity(value?: string): Rarity {
	const key = (value ?? "").trim().toLowerCase();
	return rarityMap.get(key) ?? "common";
}

function titleCase(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function normalizeFoundIn(list: string[] | undefined): string[] | undefined {
	if (!Array.isArray(list)) return undefined;
	const raw = list.map((s) => (s ?? "").trim()).filter(Boolean);
	const lowerSet = new Set(raw.map((s) => s.toLowerCase()));
	if (lowerSet.has("old") || lowerSet.has("world")) {
		lowerSet.delete("old");
		lowerSet.delete("world");
		lowerSet.add("old world");
	}
	const final = Array.from(lowerSet).map((s) =>
		s === "arc" ? "ARC" : s.split(/\s+/).map(titleCase).join(" ")
	);
	final.sort((a, b) => a.localeCompare(b));
	return final;
}

function toSlug(s: string) {
	return String(s || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.replace(/__+/g, "_");
}

function buildModsMappingIndex(metrics: Metrics) {
	const byRaw = new Map<string, MappingEntry>();
	const bySlug = new Map<string, MappingEntry>();
	for (const m of metrics.mods || []) {
		byRaw.set(m.key_raw, m);
		bySlug.set(m.key_slug, m);
	}
	return { byRaw, bySlug };
}

function mapToCanonicalModifiers(
	rawMods: Record<string, number> | undefined,
	idx: ReturnType<typeof buildModsMappingIndex>
) {
	const out: Record<
		string,
		{ kind: "additive" | "multiplicative"; unit: "percent" | "absolute"; value: number }
	> = {};
	for (const [key, val] of Object.entries(rawMods || {})) {
		const slug = toSlug(key);
		const hit = idx.byRaw.get(key) || idx.bySlug.get(slug);
		if (!hit) continue;
		let valueSigned: number;
		if (hit.kind === "multiplicative" && hit.unit === "percent") {
			const v = Number(val) / 100;
			valueSigned = hit.sign === "positive" ? +v : -v;
		} else if (hit.kind === "additive" && hit.unit === "absolute") {
			const v = Number(val);
			valueSigned = hit.sign === "positive" ? +v : -v;
		} else {
			valueSigned = Number(val);
		}
		out[hit.normalized] = { kind: hit.kind, unit: hit.unit, value: valueSigned };
	}
	return out;
}

async function readJson<T>(filePath: string): Promise<T> {
	const raw = await readFile(filePath, "utf-8");
	return JSON.parse(raw) as T;
}

async function upsertModItem(
	rec: ScrapedMod,
	modifiersCanonical: Record<string, any>,
	currentVersionId: number
) {
	const desc = (rec.description ?? "").trim();
	const mapped = {
		id: rec.id,
		name: rec.name,
		description: desc.startsWith("File:") ? "?" : desc,
		flavorText: rec.caption ? rec.caption.trim() : undefined,
		rarity: normalizeRarity(rec.rarity),
		value: typeof rec.sell_price === "number" ? Math.trunc(rec.sell_price) : 0,
		weight: typeof rec.weight === "number" ? rec.weight : 0,
		maxStack: typeof rec.stack_size === "number" ? Math.trunc(rec.stack_size) : 1,
		category: "modification" as const,
		foundIn: normalizeFoundIn(rec.found_in) ?? [],
		modifiers: Object.keys(modifiersCanonical).length ? modifiersCanonical : null,
	} as const;

	const existing = await db.select().from(items).where(eq(items.id, rec.id));
	if (existing.length > 0) {
		const update: any = { ...mapped };
		if ((existing as any)[0].versionId == null) update.versionId = currentVersionId;
		await db.update(items).set(update).where(eq(items.id, rec.id));
		return { id: rec.id, action: "updated" as const };
	} else {
		await db.insert(items).values({ ...mapped, versionId: currentVersionId });
		return { id: rec.id, action: "inserted" as const };
	}
}

async function ensureCraftRecipe(rec: ScrapedMod, currentVersionId: number) {
	const rawList = rec.recipe;
	if (!Array.isArray(rawList) || rawList.length === 0) return;
	const first = rawList[0] as any;
	const recipeId = `craft_${rec.id}`;
	const isBlueprintLocked = Boolean(first?.blueprint);
	const existing = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existing.length === 0) {
		await db
			.insert(recipes)
			.values({
				id: recipeId,
				type: "crafting",
				isBlueprintLocked,
				inRaid: false,
				versionId: currentVersionId,
			});
	} else {
		const update: any = { type: "crafting", isBlueprintLocked, inRaid: false };
		if ((existing as any)[0].versionId == null) update.versionId = currentVersionId;
		await db.update(recipes).set(update).where(eq(recipes.id, recipeId));
	}
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	if (first?.ingredients && typeof first.ingredients === "object") {
		for (const [itemId, qty] of Object.entries(first.ingredients)) {
			const n = typeof qty === "number" ? qty : Number(qty as any) || 0;
			if (n <= 0) continue;
			await db.insert(recipeItems).values({ recipeId, itemId, role: "input", qty: n });
		}
	}
	await db.insert(recipeItems).values({ recipeId, itemId: rec.id, role: "output", qty: 1 });
	// set canonical crafting recipe pointer on item
	await db.update(items).set({ recipeId }).where(eq(items.id, rec.id));
}

async function ensureRecycleRecipe(rec: ScrapedMod, currentVersionId: number) {
	const recycled = rec.recycling;
	if (!recycled || typeof recycled !== "object") return;
	const recipeId = `recycle_${rec.id}`;
	const existing = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existing.length === 0) {
		await db
			.insert(recipes)
			.values({
				id: recipeId,
				type: "recycling",
				isBlueprintLocked: false,
				inRaid: false,
				versionId: currentVersionId,
			});
	}
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	await db.insert(recipeItems).values({ recipeId, itemId: rec.id, role: "input", qty: 1 });
	for (const [itemId, qty] of Object.entries(recycled)) {
		const n = typeof qty === "number" ? qty : Number(qty as any) || 0;
		if (n <= 0) continue;
		await db.insert(recipeItems).values({ recipeId, itemId, role: "output", qty: n });
	}
	// set canonical recycling recipe pointer on item
	await db.update(items).set({ recyclingId: recipeId }).where(eq(items.id, rec.id));
}

async function main() {
	const currentVersionId = await ensureCurrentVersionId();
	const mods = await readJson<ScrapedMod[]>(MODS_FILE);
	const metrics = await readJson<Metrics>(METRICS_FILE);
	const idx = buildModsMappingIndex(metrics);

	// Collect compatible mods per weaponId
	const compat: Record<string, Set<string>> = {};

	let ok = 0;
	let fail = 0;
	for (const rec of mods) {
		try {
			const modifiers = mapToCanonicalModifiers(rec.stat_modifiers || {}, idx);
			const a = await upsertModItem(rec, modifiers, currentVersionId);
			await ensureCraftRecipe(rec, currentVersionId);
			await ensureRecycleRecipe(rec, currentVersionId);

			const allowed = Array.isArray(rec.compatible_weapons) ? rec.compatible_weapons : [];
			for (const wid of allowed) {
				if (!compat[wid]) compat[wid] = new Set<string>();
				compat[wid].add(rec.id);
			}

			ok++;
			console.log(`Mod ${rec.id}: item ${a.action}`);
		} catch (e: any) {
			fail++;
			console.error(`Failed ${rec.id}:`, e?.message || e);
		}
	}

	// Update weapons.compatible_mods
	for (const [weaponId, set] of Object.entries(compat)) {
		const arr = Array.from(set);
		await db.update(weapons).set({ compatibleMods: arr }).where(eq(weapons.itemId, weaponId));
	}

	console.log(
		`Done. Success: ${ok}, Failures: ${fail}. Updated weapons with compat: ${
			Object.keys(compat).length
		}`
	);
}

main().catch((e) => {
	console.error("Mod importer error:", e);
	process.exit(1);
});
