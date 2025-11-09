import { readFile } from "fs/promises";
import path from "path";
import { db } from "../src/db/drizzle";
import { weapons, upgrade, recipes, recipeItems } from "../src/db/schema";
import { eq } from "drizzle-orm";

// Input types
interface ScrapedUpgradeEntry {
	from_level?: number;
	to_level?: number;
	materials?: Record<string, number>;
	perks?: Record<string, number>;
	repair_materials?: Record<string, number>;
	recycled_materials?: Record<string, number>;
	repair_durability?: number;
	sell_price?: number;
}

interface ScrapedWeapon {
	id: string; // weapon item id
	name: string;
	upgrades?: ScrapedUpgradeEntry[];
}

// Mapping file types
type MappingEntry = {
	key_raw: string;
	key_slug: string;
	normalized: string;
	kind: "additive" | "multiplicative";
	unit: "percent" | "absolute";
	sign: "positive" | "negative";
};

type Metrics = {
	mods?: MappingEntry[];
	upgrades?: MappingEntry[];
};

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const WEAPONS_FILE = path.join(DATA_DIR, "weapon_items_enriched.json");
const METRICS_FILE = path.join(DATA_DIR, "stat_mapping_metrics.json");

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
	// Merge mappings from both mods and upgrades sections
	const all = [...(metrics.mods || []), ...(metrics.upgrades || [])];
	for (const m of all) {
		byRaw.set(m.key_raw, m);
		bySlug.set(m.key_slug, m);
	}
	return { byRaw, bySlug };
}

function mapToCanonicalModifiers(
	raw: Record<string, number> | undefined,
	idx: ReturnType<typeof buildModsMappingIndex>
) {
	const out: Record<
		string,
		{ kind: "additive" | "multiplicative"; unit: "percent" | "absolute"; value: number }
	> = {};
	const unmapped: Array<{ key: string; slug: string }> = [];
	for (const [key, val] of Object.entries(raw || {})) {
		const slug = toSlug(key);
		const hit = idx.byRaw.get(key) || idx.bySlug.get(slug);
		if (!hit) {
			unmapped.push({ key, slug });
			continue;
		}
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
	return { canonical: out, unmapped };
}

async function readJson<T>(filePath: string): Promise<T> {
	const raw = await readFile(filePath, "utf-8");
	return JSON.parse(raw) as T;
}

async function ensureUpgradeRecipe(
	weaponItemId: string,
	level: number,
	materials?: Record<string, number>
) {
	const recipeId = `upgrade_${weaponItemId}_lvl${level}`;
	const existing = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existing.length === 0) {
		await db
			.insert(recipes)
			.values({ id: recipeId, type: "upgrade", isBlueprintLocked: false, inRaid: false });
	} else {
		await db
			.update(recipes)
			.set({ type: "upgrade", isBlueprintLocked: false, inRaid: false })
			.where(eq(recipes.id, recipeId));
	}
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	// Inputs: weapon itself (qty 1) + materials
	await db.insert(recipeItems).values({ recipeId, itemId: weaponItemId, role: "input", qty: 1 });
	for (const [itemId, qty] of Object.entries(materials || {})) {
		const n = typeof qty === "number" ? qty : Number(qty as any) || 0;
		if (n <= 0) continue;
		await db.insert(recipeItems).values({ recipeId, itemId, role: "input", qty: n });
	}
	// Output remains the weapon (qty 1)
	await db.insert(recipeItems).values({ recipeId, itemId: weaponItemId, role: "output", qty: 1 });
	return recipeId;
}

async function ensureRecycleRecipe(
	weaponItemId: string,
	level: number,
	recycled?: Record<string, number>
) {
	if (!recycled || typeof recycled !== "object") return;
	const recipeId = `recycle_${weaponItemId}_lvl${level}`;
	const existing = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existing.length === 0) {
		await db
			.insert(recipes)
			.values({ id: recipeId, type: "recycling", isBlueprintLocked: false, inRaid: false });
	}
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	// Input: weapon at this level (we don't distinguish per-level items, use same item id)
	await db.insert(recipeItems).values({ recipeId, itemId: weaponItemId, role: "input", qty: 1 });
	for (const [itemId, qty] of Object.entries(recycled)) {
		const n = typeof qty === "number" ? qty : Number(qty as any) || 0;
		if (n <= 0) continue;
		await db.insert(recipeItems).values({ recipeId, itemId, role: "output", qty: n });
	}
}

async function upsertUpgradeRow(
	weaponRowId: number,
	weaponItemId: string,
	level: number,
	perks: Record<string, any>,
	sellPrice?: number | null,
	recipeId?: string
) {
	const existing = await db.select().from(upgrade).where(eq(upgrade.weaponId, weaponRowId));
	const existsForLevel = existing.find((u) => u.level === level);
	const payload = {
		weaponId: weaponRowId,
		level,
		description: null,
		modifiers: perks,
		recipeId: recipeId,
		sellPrice: typeof sellPrice === "number" ? Math.trunc(sellPrice) : null,
	} as const;
	if (existsForLevel) {
		await db.update(upgrade).set(payload).where(eq(upgrade.id, existsForLevel.id));
	} else {
		await db.insert(upgrade).values(payload);
	}
}

async function main() {
	const list = await readJson<ScrapedWeapon[]>(WEAPONS_FILE);
	const metrics = await readJson<Metrics>(METRICS_FILE);
	const idx = buildModsMappingIndex(metrics);

	let ok = 0;
	let fail = 0;

	for (const rec of list) {
		if (!Array.isArray(rec.upgrades) || rec.upgrades.length === 0) continue;
		try {
			// lookup weapon row by itemId
			const w = await db.select().from(weapons).where(eq(weapons.itemId, rec.id));
			if (w.length === 0) continue; // weapon not in DB
			const weaponRow = w[0];

			for (const u of rec.upgrades) {
				const level = (
					Number.isFinite(u.to_level) ? (u.to_level as number) : (u.from_level ?? 0) + 1
				) as number;
				const { canonical: perks, unmapped } = mapToCanonicalModifiers(u.perks || {}, idx);
				if (unmapped.length > 0) {
					console.warn(
						`Unmapped upgrade perks for ${rec.id} lvl ${level}: ` +
							unmapped.map((x) => `${x.key} [${x.slug}]`).join(", ")
					);
				}

				const recipeId = await ensureUpgradeRecipe(rec.id, level, u.materials);
				await ensureRecycleRecipe(rec.id, level, u.recycled_materials);
				await upsertUpgradeRow(
					weaponRow.id,
					rec.id,
					level,
					perks,
					u.sell_price ?? null,
					recipeId
				);
			}

			ok++;
			console.log(`Upgrades for ${rec.id}: processed ${rec.upgrades.length}`);
		} catch (e: any) {
			fail++;
			console.error(`Failed upgrades for ${rec.id}:`, e?.message || e);
		}
	}

	console.log(`Done upgrades. Success: ${ok}, Failures: ${fail}`);
}

main().catch((e) => {
	console.error("Upgrade importer error:", e);
	process.exit(1);
});
