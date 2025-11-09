import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../src/db/drizzle";
import { items, weapons, recipes, recipeItems } from "../src/db/schema";
import type { Rarity } from "../src/db/schema/enums";
import type { WeaponModSlot } from "../src/types/items/weapon";

interface ScrapedWeapon {
	id: string;
	name: string;
	description?: string;
	caption?: string;
	image?: string;
	verbose_category?: string;
	category_tags?: string[];
	rarity?: string;
	weight?: number;
	stack_size?: number;
	sell_price?: number;
	found_in?: string[];
	ammo_type?: string;
	class?: string;
	weapon_class?: string;
	weapon_type?: string;
	mod_slots?: string[]; // e.g., ["muzzle","grip",...]
	stats?: Record<string, number>;
	weapon_stats?: Record<string, number>;
	base?: any;
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const WEAPONS_FILE = path.join(DATA_DIR, "weapon_items_enriched.json");

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

const KNOWN_KEYS: Record<string, string> = {
	damage: "damage",
	fire_rate: "fire_rate",
	firerate: "fire_rate",
	range: "range",
	stability: "stability",
	agility: "agility",
	stealth: "stealth",
	durability_burn: "durability_burn",
	durabilityburn: "durability_burn",
	magazine_size: "magazine_size",
	magazinesize: "magazine_size",
	bullet_velocity: "bullet_velocity",
	bulletvelocity: "bullet_velocity",
	reload_time: "reload_time",
	reloadtime: "reload_time",
	recoil_horizontal: "recoil_horizontal",
	recoilhorizontal: "recoil_horizontal",
	recoil_vertical: "recoil_vertical",
	recoilvertical: "recoil_vertical",
};

function extractBaseStats(obj: any) {
	const canonical: Record<
		string,
		{ kind: "additive" | "multiplicative"; unit: "percent" | "absolute"; value: number }
	> = {};
	const srcs: any[] = [];
	if (obj && typeof obj === "object") {
		if (obj.stats) srcs.push(obj.stats);
		if (obj.weapon_stats) srcs.push(obj.weapon_stats);
		srcs.push(obj);
	}
	const seen = new Set<string>();
	// helper to coerce numeric
	const asNum = (x: any): number | null => {
		if (typeof x === "number" && Number.isFinite(x)) return x;
		if (typeof x === "string" && x.trim() !== "" && !isNaN(Number(x))) return Number(x);
		return null;
	};
	for (const s of srcs) {
		if (!s || typeof s !== "object") continue;
		const entries = Object.entries(s);
		for (const [k, v] of entries) {
			const slug = toSlug(k);
			if (seen.has(slug)) continue;
			const n = asNum(v);
			if (n !== null) {
				const norm = KNOWN_KEYS[slug];
				if (norm) {
					canonical[norm] = { kind: "additive", unit: "absolute", value: n };
					seen.add(slug);
					continue;
				}
				if (slug.endsWith("_pct")) {
					const baseKey = slug.replace(/_pct$/, "");
					canonical[baseKey] = {
						kind: "multiplicative",
						unit: "percent",
						value: n / 100,
					};
					seen.add(slug);
					continue;
				}
			}
			// shallow nested objects: e.g. { base: { damage: 10 } }
			if (v && typeof v === "object") {
				for (const [k2, v2] of Object.entries(v)) {
					const slug2 = toSlug(`${k2}`);
					if (seen.has(slug2)) continue;
					const n2 = asNum(v2);
					if (n2 !== null) {
						const norm2 = KNOWN_KEYS[slug2];
						if (norm2) {
							canonical[norm2] = { kind: "additive", unit: "absolute", value: n2 };
							seen.add(slug2);
						} else if (slug2.endsWith("_pct")) {
							const baseKey2 = slug2.replace(/_pct$/, "");
							canonical[baseKey2] = {
								kind: "multiplicative",
								unit: "percent",
								value: n2 / 100,
							};
							seen.add(slug2);
						}
					}
				}
			}
		}
	}
	return canonical;
}

function mapAmmoType(v?: string) {
	const s = (v ?? "").toLowerCase().trim();
	// take first word only (e.g., "Medium Ammo" -> "medium")
	const first = s.split(/\s+/)[0] || "";
	if (["light", "medium", "heavy", "shotgun", "energy", "launcher"].includes(first))
		return first as any;
	return null;
}

function mapWeaponClass(v?: string) {
	const s = (v ?? "").toLowerCase().replace(/\s+/g, "_");
	const allowed = [
		"assault_rifle",
		"battle_rifle",
		"smg",
		"shotgun",
		"pistol",
		"hand_cannon",
		"lmg",
		"sniper_rifle",
		"special",
	];
	return allowed.includes(s) ? (s as any) : null;
}

function mapModSlots(list?: string[]): WeaponModSlot[] {
	if (!Array.isArray(list)) return [];
	const allowed: WeaponModSlot[] = ["muzzle", "grip", "magazine", "stock", "tech"];
	const out: WeaponModSlot[] = [];
	for (const v of list) {
		let k = toSlug(String(v).replace(/-/g, "_"));
		// normalize common scraped variants
		if (k === "underbarrel") k = "grip";
		if (/_mag(azine)?$/.test(k)) k = "magazine";
		if (allowed.includes(k as WeaponModSlot)) out.push(k as WeaponModSlot);
	}
	// dedupe in stable order
	return Array.from(new Set(out));
}

async function readJson(filePath: string) {
	const raw = await readFile(filePath, "utf-8");
	return JSON.parse(raw) as ScrapedWeapon[];
}

async function upsertItem(rec: ScrapedWeapon) {
	const desc = (rec.description ?? "").trim();
	const base = (rec as any).base || {};
	const mapped = {
		id: rec.id,
		name: rec.name,
		description: desc.startsWith("File:") ? "?" : desc,
		flavorText: rec.caption ? rec.caption.trim() : undefined,
		rarity: normalizeRarity(rec.rarity),
		value:
			typeof base.sell_price === "number"
				? Math.trunc(base.sell_price)
				: typeof rec.sell_price === "number"
					? Math.trunc(rec.sell_price)
					: 0,
		weight:
			typeof base.weight === "number"
				? base.weight
				: typeof rec.weight === "number"
					? rec.weight
					: 0,
		maxStack: typeof rec.stack_size === "number" ? Math.trunc(rec.stack_size) : 1,
		category: "weapon" as const,
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

async function upsertWeapon(rec: ScrapedWeapon) {
	const baseObj = (rec as any).base ?? rec;
	const baseStats = extractBaseStats(baseObj);
	const mapped = {
		itemId: rec.id,
		ammoType: mapAmmoType(rec.ammo_type) ?? undefined,
		weaponClass:
			mapWeaponClass((rec as any).weapon_type || rec.weapon_class || rec.class) ?? undefined,
		modSlots: mapModSlots(rec.mod_slots),
		statsBase: baseStats,
	} as const;

	const existing = await db.select().from(weapons).where(eq(weapons.itemId, rec.id));
	if (existing.length > 0) {
		await db.update(weapons).set(mapped).where(eq(weapons.itemId, rec.id));
		return { id: rec.id, action: "updated" as const };
	} else {
		await db.insert(weapons).values(mapped);
		return { id: rec.id, action: "inserted" as const };
	}
}

async function ensureRecycleRecipe(rec: ScrapedWeapon) {
	const base = (rec as any).base;
	if (!base || !base.recycled_materials || typeof base.recycled_materials !== "object") return;
	const recipeId = `recycle_${rec.id}`;
	// upsert recipe
	const existing = await db.select().from(recipes).where(eq(recipes.id, recipeId));
	if (existing.length === 0) {
		await db
			.insert(recipes)
			.values({ id: recipeId, type: "recycling", isBlueprintLocked: false, inRaid: false });
	}
	// clear previous IO rows for idempotence
	await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
	// insert input: the weapon itself (qty 1)
	await db.insert(recipeItems).values({ recipeId, itemId: rec.id, role: "input", qty: 1 });
	// insert outputs
	for (const [materialId, qty] of Object.entries(base.recycled_materials)) {
		const n = typeof qty === "number" ? qty : Number(qty as any) || 0;
		if (n <= 0) continue;
		await db
			.insert(recipeItems)
			.values({ recipeId, itemId: materialId, role: "output", qty: n });
	}
}

(async function main() {
	try {
		const list = await readJson(WEAPONS_FILE);
		let ok = 0;
		let fail = 0;

		for (const rec of list) {
			try {
				const a = await upsertItem(rec);
				const stats = extractBaseStats((rec as any).base ?? rec);
				if (Object.keys(stats).length === 0) {
					// gather a few numeric-like keys for diagnostics
					const candidates: string[] = [];
					const scan = (o: any) => {
						if (!o || typeof o !== "object") return;
						for (const [k, v] of Object.entries(o)) {
							if (
								typeof v === "number" ||
								(typeof v === "string" && !isNaN(Number(v)))
							) {
								candidates.push(`${k}`);
								if (candidates.length >= 6) return;
							}
						}
					};
					scan((rec as any).base?.stats);
					scan((rec as any).base?.weapon_stats);
					console.warn(
						`No base stats parsed for ${rec.id}. Sample numeric keys: ${candidates.join(", ")}`
					);
				}
				const b = await upsertWeapon({ ...rec });
				await ensureRecycleRecipe(rec);
				ok++;
				console.log(`Weapon ${rec.id}: item ${a.action}, weapon ${b.action}`);
			} catch (e: any) {
				fail++;
				console.error(`Failed ${rec.id}:`, e?.message || e);
			}
		}

		console.log(`Done. Success: ${ok}, Failures: ${fail}`);
		if (fail > 0) process.exitCode = 1;
	} catch (e: any) {
		console.error("Importer error:", e?.message || e);
		process.exit(1);
	}
})();
