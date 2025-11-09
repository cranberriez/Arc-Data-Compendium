import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const WEAPONS_SRC = join(ROOT, "scripts", "data", "weapon_items_enriched.json");
const METRICS_PATH = join(ROOT, "scripts", "data", "stat_mapping_metrics.json");
const OUT_DIR = join(ROOT, "scripts", "data", "_generated");
const OUT_PATH = join(OUT_DIR, "weapon_upgrades_stats_preview.json");

function ensureDir(p: string) {
	if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

type MappingEntry = {
	key_raw: string;
	key_slug: string;
	normalized: string;
	kind: "additive" | "multiplicative";
	unit: "percent" | "absolute";
	sign: "positive" | "negative";
	notes?: string;
};

type Metrics = {
	mods?: MappingEntry[];
	upgrades: MappingEntry[];
};

function buildUpgradesMappingIndex(metrics: Metrics) {
	const byRaw = new Map<string, MappingEntry>();
	const bySlug = new Map<string, MappingEntry>();
	for (const m of metrics.upgrades || []) {
		byRaw.set(m.key_raw, m);
		bySlug.set(m.key_slug, m);
	}
	return { byRaw, bySlug };
}

function toSlug(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.replace(/__+/g, "_");
}

function mapPerk(key: string, val: number, idx: ReturnType<typeof buildUpgradesMappingIndex>) {
	const slug = toSlug(key);
	const rawHit = idx.byRaw.get(key);
	const slugHit = idx.bySlug.get(slug);
	const hit = rawHit || slugHit;
	if (!hit) {
		return {
			found: false as const,
			raw_key: key,
			raw_value: val,
			hint_slug: slug,
			index_has_raw: idx.byRaw.has(key),
			index_has_slug: idx.bySlug.has(slug),
			reason:
				`No mapping for raw_key="${key}" (raw match: ${idx.byRaw.has(key)}), slug="${slug}" (slug match: ${idx.bySlug.has(slug)}). ` +
				`Check metrics file entry exists in upgrades[], key_raw or key_slug typos, or unsaved file before run.`,
		};
	}

	let value_signed: number;
	if (hit.kind === "multiplicative" && hit.unit === "percent") {
		const v = Number(val) / 100;
		value_signed = hit.sign === "positive" ? +v : -v;
	} else if (hit.kind === "additive" && hit.unit === "absolute") {
		const v = Number(val);
		value_signed = hit.sign === "positive" ? +v : -v;
	} else {
		value_signed = Number(val);
	}

	return {
		found: true as const,
		raw_key: key,
		raw_value: val,
		normalized: hit.normalized,
		kind: hit.kind,
		unit: hit.unit,
		sign: hit.sign,
		value_signed,
	};
}

(function main() {
	const weapons = JSON.parse(readFileSync(WEAPONS_SRC, "utf-8")) as any[];
	const metrics = JSON.parse(readFileSync(METRICS_PATH, "utf-8")) as Metrics;
	const index = buildUpgradesMappingIndex(metrics);

	const preview = weapons.map((w) => {
		const upgrades = Array.isArray(w.upgrades) ? w.upgrades : [];
		const tiers = upgrades.map((u: any, i: number) => {
			const perks = u?.perks || {};
			const mapped = Object.entries(perks).map(([k, v]) =>
				mapPerk(String(k), Number(v), index)
			);
			const known = mapped.filter((m) => m.found);
			const unknown = mapped.filter((m) => !m.found);
			return {
				index: i,
				level: u?.level ?? u?.tier ?? null,
				raw_perks: perks,
				normalized_perks: known,
				unmapped: unknown,
			};
		});

		return {
			id: w.id,
			name: w.name,
			upgrades_count: upgrades.length,
			tiers,
		};
	});

	ensureDir(OUT_DIR);
	writeFileSync(OUT_PATH, JSON.stringify(preview, null, 2), "utf-8");
	console.log("Wrote preview:", OUT_PATH);

	// Diagnostics for unmapped keys across all weapons
	const allUnknown = preview.flatMap((p: any) =>
		p.tiers.flatMap((t: any) => t.unmapped as any[])
	);
	const uniq: Record<
		string,
		{ hint_slug: string; index_has_raw: boolean; index_has_slug: boolean; count: number }
	> = {};
	for (const u of allUnknown) {
		const k = String(u.raw_key);
		if (!uniq[k])
			uniq[k] = {
				hint_slug: u.hint_slug,
				index_has_raw: !!u.index_has_raw,
				index_has_slug: !!u.index_has_slug,
				count: 0,
			};
		uniq[k].count += 1;
	}
	const entries = Object.entries(uniq);
	if (entries.length) {
		console.log("Unmapped upgrade perk keys summary:");
		for (const [k, info] of entries) {
			console.log(
				`  - ${k} (slug: ${info.hint_slug}) | byRaw: ${info.index_has_raw}, bySlug: ${info.index_has_slug}, occurrences: ${info.count}`
			);
		}
	} else {
		console.log("All upgrade perk keys mapped successfully.");
	}
})();
