import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../src/db/drizzle";
import { items } from "../src/db/schema";
import type { ItemCategory, Rarity } from "../src/db/schema/enums";
import type { QuickUseData } from "../src/types/items/quickuse";

// Input record shape from scraped JSON (partial)
interface ScrapedItem {
	id: string;
	name: string;
	description?: string;
	caption?: string;
	image?: string;
	type?: string;
	verbose_category?: string;
	category_tags?: string[];
	rarity?: string;
	weight?: number;
	stack_size?: number;
	sell_price?: number;
	found_in?: string[];
	augment?: {
		backpack_slots?: number;
		safe_pocket_slots?: number;
		quick_use_slots?: number;
		weapon_slots?: number;
		weight_limit?: number;
		shield_compatibility?: string[];
	};
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const FILES = [
	{ file: "arc_raiders_items_enriched.json", kind: "general" as const },
	{ file: "augment_items_enriched.json", kind: "augment" as const },
	{ file: "grenade_items_enriched.json", kind: "grenade" as const },
	{ file: "healing_items_enriched.json", kind: "healing" as const },
	{ file: "quick_use_items_enriched.json", kind: "quick_use" as const },
	{ file: "trap_items_enriched.json", kind: "trap" as const },
];

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

function mapCategory(scraped: ScrapedItem, kind: (typeof FILES)[number]["kind"]): ItemCategory {
	// Prefer explicit mapping from known verbose categories
	const v = (scraped.verbose_category || scraped.type || "").toLowerCase();
	const tags = (scraped.category_tags || []).map((t) => t.toLowerCase());

	// direct maps from verbose category -> enum
	if (
		v.includes("topside material") ||
		v.includes("topside materials") ||
		tags.includes("topside material") ||
		tags.includes("topside materials")
	)
		return "topside_material";
	if (v.includes("refined material") || tags.includes("refined material"))
		return "refined_material";
	if (v.includes("advanced material") || tags.includes("advanced material"))
		return "advanced_material";
	if (v.includes("basic material") || tags.includes("basic material")) return "basic_material";
	if (v.includes("recyclable") || tags.includes("recyclable")) return "recyclable";
	if (v.includes("trinket") || tags.includes("trinket")) return "trinket";
	if (v.includes("key") || tags.includes("key")) return "key";
	if (v.includes("augment") || tags.includes("augment")) return "augment";
	if (v.includes("shield") || tags.includes("shield")) return "shield";
	if (v.includes("nature") || tags.includes("nature")) return "nature";
	if (v.includes("ammo") || tags.includes("ammo")) return "ammo";
	if (v.includes("weapon") || tags.includes("weapon")) return "weapon";
	if (v.includes("trap") || tags.includes("trap")) return "trap";

	// dataset-specific defaults
	if (kind === "augment") return "augment";
	if (kind === "grenade" || kind === "healing" || kind === "quick_use") return "quick_use";

	// fallback
	return "misc";
}

function titleCase(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function normalizeFoundIn(list: string[] | undefined): string[] | undefined {
	if (!Array.isArray(list)) return undefined;
	const raw = list.map((s) => (s ?? "").trim()).filter(Boolean);
	const lowerSet = new Set(raw.map((s) => s.toLowerCase()));

	// Merge "Old" + "World" into "Old World" when either/both appear
	if (lowerSet.has("old") || lowerSet.has("world")) {
		lowerSet.delete("old");
		lowerSet.delete("world");
		lowerSet.add("old world");
	}

	const final = Array.from(lowerSet).map((s) => {
		if (s === "arc") return "ARC";
		return s.split(/\s+/).map(titleCase).join(" ");
	});
	final.sort((a, b) => a.localeCompare(b));
	return final;
}

function mapShieldCompat(list?: string[]): ("light" | "medium" | "heavy")[] {
	if (!Array.isArray(list)) return [];
	const out: ("light" | "medium" | "heavy")[] = [];
	for (const v of list) {
		const k = String(v || "")
			.trim()
			.toLowerCase();
		if (k === "light" || k === "medium" || k === "heavy") out.push(k);
	}
	return Array.from(new Set(out));
}

function mapAugmentStatsOrThrow(rec: ScrapedItem) {
	const a = rec.augment ?? {};
	const backpackSlots = a.backpack_slots;
	const safePocketSize = a.safe_pocket_slots;
	const quickUseSlots = a.quick_use_slots;
	const weaponSlots = a.weapon_slots;
	const weightLimit = a.weight_limit;
	const supportedShieldTypes = mapShieldCompat(a.shield_compatibility);

	const missing: string[] = [];
	if (!Number.isFinite(backpackSlots)) missing.push("augment.backpack_slots");
	if (!Number.isFinite(safePocketSize)) missing.push("augment.safe_pocket_slots");
	if (!Number.isFinite(quickUseSlots)) missing.push("augment.quick_use_slots");
	if (!Number.isFinite(weaponSlots)) missing.push("augment.weapon_slots");
	if (!Number.isFinite(weightLimit)) missing.push("augment.weight_limit");
	if (supportedShieldTypes.length === 0) missing.push("augment.shield_compatibility");

	if (missing.length) {
		throw new Error(`Augment stats missing for ${rec.id}: ${missing.join(", ")}`);
	}

	return {
		backpackSlots: backpackSlots as number,
		weightLimit: weightLimit as number,
		safePocketSize: safePocketSize as number,
		quickUseSlots: quickUseSlots as number,
		weaponSlots: weaponSlots as number,
		supportedShieldTypes,
	} as const;
}

function buildQuickUse(kind: (typeof FILES)[number]["kind"]): QuickUseData | undefined {
	if (kind === "grenade") return { category: "throwable", stats: [] };
	if (kind === "healing") return { category: "healing", stats: [] };
	if (kind === "quick_use") return { category: "utility", stats: [] };
	if (kind === "trap") return { category: "trap", stats: [] };
	return undefined;
}

async function readJson(filePath: string) {
	const raw = await readFile(filePath, "utf-8");
	return JSON.parse(raw) as ScrapedItem[];
}

async function upsertItem(rec: ScrapedItem, kind: (typeof FILES)[number]["kind"]) {
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
		category: mapCategory(rec, kind),
		quickUse: buildQuickUse(kind),
		// gear: set only for augment dataset with strict stats mapping
		gear:
			kind === "augment"
				? {
						category: "augment" as const,
						stats: mapAugmentStatsOrThrow(rec),
					}
				: undefined,
		foundIn: normalizeFoundIn(rec.found_in) ?? [],
	} as const;

	const existing = await db.select().from(items).where(eq(items.id, rec.id));
	if (existing.length > 0) {
		await db.update(items).set(mapped).where(eq(items.id, rec.id));
		return { id: rec.id, action: "updated" as const };
	} else {
		await db.insert(items).values(mapped);
		return { id: rec.id, action: "inserted" as const };
	}
}

async function main() {
	let updated = 0;
	let inserted = 0;
	for (const def of FILES) {
		const p = path.join(DATA_DIR, def.file);
		try {
			const list = await readJson(p);
			for (const rec of list) {
				if (!rec?.id || !rec?.name) continue;
				const res = await upsertItem(rec, def.kind);
				if (res.action === "updated") updated++;
				else inserted++;
			}
			console.log(`Processed ${def.file}`);
		} catch (e) {
			console.error(`Failed processing ${def.file}:`, e);
		}
	}
	console.log(`Done. Inserted: ${inserted}, Updated: ${updated}`);
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
