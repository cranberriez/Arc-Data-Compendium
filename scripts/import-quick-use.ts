import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../src/db/drizzle";
import { items } from "../src/db/schema";
import type { QuickUseData, QuickUseStat } from "../src/types/items/quickuse";

interface ScrapedItemAny {
	id: string;
	name?: string;
	quick_use?: any;
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const SOURCES = [
	{ file: "grenade_items_enriched.json", kind: "grenade" as const },
	{ file: "trap_items_enriched.json", kind: "trap" as const },
	{ file: "healing_items_enriched.json", kind: "healing" as const },
	{ file: "quick_use_items_enriched.json", kind: "quick_use" as const },
];

type SourceKind = (typeof SOURCES)[number]["kind"];

async function readJson<T = ScrapedItemAny>(p: string): Promise<T[]> {
	const raw = await readFile(p, "utf-8");
	return JSON.parse(raw) as T[];
}

function ensureNumber(v: any): number | undefined {
	return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function pushIf<T>(arr: T[], val: T | undefined) {
	if (val !== undefined) arr.push(val);
}

function normalizeGrenadeOrTrap(kind: SourceKind, quick: any): QuickUseData {
	// supports structures like { thrown: { damage, duration, radius, effect, projectiles }, duration }
	// For trap data, "thrown" should conceptually be "placed"; we treat it equivalently
	const node = quick?.thrown ?? quick?.placed ?? {};
	const stats: QuickUseStat[] = [];

	const damage = ensureNumber(node.damage);
	const duration = ensureNumber(node.duration ?? quick?.duration);
	const radius = ensureNumber(node.radius ?? node.range);
	const projectiles = ensureNumber(node.projectiles);
	const effectText = typeof node.effect === "string" ? node.effect : undefined;
	const arcStun = ensureNumber(node.arc_stun);
	const raiderStun = ensureNumber(node.raider_stun);
	const useTime = ensureNumber(quick?.use_time);
	const delay = ensureNumber(quick?.delay);

	if (damage !== undefined) {
		stats.push({ name: "damage", value: damage, effect: effectText });
	}
	if (duration !== undefined) {
		stats.push({ name: "duration", duration });
	}
	if (radius !== undefined) {
		stats.push({ name: "range", range: radius });
	}
	if (projectiles !== undefined) {
		stats.push({ name: "projectiles", value: projectiles });
	}
	if (arcStun !== undefined) {
		stats.push({ name: "stun", duration: arcStun, effect: "arc" });
	}
	if (raiderStun !== undefined) {
		stats.push({ name: "stun", duration: raiderStun, effect: "raider" });
	}
	if (useTime !== undefined) {
		stats.push({ name: "use_time", value: useTime });
	}
	if (delay !== undefined) {
		stats.push({ name: "delay", value: delay });
	}

	// Fallback: include any additional numeric fields we haven't explicitly mapped
	const handled = new Set([
		"damage",
		"duration",
		"radius",
		"range",
		"projectiles",
		"effect",
		"arc_stun",
		"raider_stun",
	]);
	for (const [key, val] of Object.entries(node)) {
		if (handled.has(key)) continue;
		if (typeof val === "number" && Number.isFinite(val)) {
			stats.push({ name: key, value: val });
		}
	}

	const category: QuickUseData["category"] = kind === "grenade" ? "throwable" : "trap";
	return { category, stats };
}

function normalizeHealing(quick: any): QuickUseData {
	// Structure example:
	// { health: { health: 25, type: "instant" }, stamina: { stamina: 50, type: "instant" }, use_time: 2 }
	const stats: QuickUseStat[] = [];
	const hVal = ensureNumber(quick?.health?.health);
	const hType = typeof quick?.health?.type === "string" ? quick.health.type : undefined;
	if (hVal !== undefined) {
		stats.push({
			name: "healing",
			value: hVal,
			perSecond: hType?.toLowerCase() === "over_time",
		});
	}

	const sVal = ensureNumber(quick?.stamina?.stamina);
	const sType = typeof quick?.stamina?.type === "string" ? quick.stamina.type : undefined;
	if (sVal !== undefined) {
		stats.push({
			name: "stamina",
			value: sVal,
			perSecond: sType?.toLowerCase() === "over_time",
		});
	}

	const useTime = ensureNumber(quick?.use_time);
	if (useTime !== undefined) stats.push({ name: "use_time", value: useTime });

	const delay = ensureNumber(quick?.delay);
	if (delay !== undefined) stats.push({ name: "delay", value: delay });

	const duration = ensureNumber(quick?.duration);
	if (duration !== undefined) stats.push({ name: "duration", duration });

	return { category: "healing", stats };
}

function normalizeUtility(quick: any): QuickUseData {
	// Some files have nested quick_use.quick_use.range
	const node = quick?.quick_use ?? quick;
	const stats: QuickUseStat[] = [];
	const range = ensureNumber(node?.range);
	if (range !== undefined) stats.push({ name: "range", range });

	const useTime = ensureNumber(node?.use_time ?? quick?.use_time);
	if (useTime !== undefined) stats.push({ name: "use_time", value: useTime });

	const duration = ensureNumber(node?.duration ?? quick?.duration);
	if (duration !== undefined) stats.push({ name: "duration", duration });

	return { category: "utility", stats };
}

function buildQuickUse(kind: SourceKind, quick: any): QuickUseData | undefined {
	if (!quick) return undefined;
	if (kind === "grenade" || kind === "trap") return normalizeGrenadeOrTrap(kind, quick);
	if (kind === "healing") return normalizeHealing(quick);
	if (kind === "quick_use") return normalizeUtility(quick);
	return undefined;
}

async function upsertQuickUseFromList(kind: SourceKind, list: ScrapedItemAny[]) {
	let count = 0;
	for (const rec of list) {
		if (!rec?.id) continue;
		const quick = buildQuickUse(kind, rec.quick_use);
		if (!quick) continue;

		await db.update(items).set({ quickUse: quick }).where(eq(items.id, rec.id));
		count++;
	}
	return count;
}

async function main() {
	let total = 0;
	for (const def of SOURCES) {
		const p = path.join(DATA_DIR, def.file);
		try {
			const list = await readJson<ScrapedItemAny>(p);
			const n = await upsertQuickUseFromList(def.kind, list);
			total += n;
			console.log(`Processed ${def.file}: updated ${n} items`);
		} catch (e) {
			console.error(`Failed processing ${def.file}:`, e);
		}
	}
	console.log(`Done. Updated quick use for ${total} items.`);
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
