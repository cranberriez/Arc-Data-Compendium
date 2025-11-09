import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const MODS_SRC = join(ROOT, "scripts", "data", "modification_items_enriched.json");
const METRICS_PATH = join(ROOT, "scripts", "data", "stat_mapping_metrics.json");
const OUT_DIR = join(ROOT, "scripts", "data", "_generated");
const OUT_PATH = join(OUT_DIR, "mods_stats_preview.json");

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
	mods: MappingEntry[];
	upgrades?: MappingEntry[];
};

function buildModsMappingIndex(metrics: Metrics) {
	const byRaw = new Map<string, MappingEntry>();
	const bySlug = new Map<string, MappingEntry>();
	for (const m of metrics.mods || []) {
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

function mapModifier(key: string, val: number, idx: ReturnType<typeof buildModsMappingIndex>) {
	// Try exact raw match, then slug match
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
				`Check metrics file entry exists in mods[], key_raw or key_slug typos, or unsaved file before run.`,
		};
	}

	// Compute signed value
	let value_signed: number;
	if (hit.kind === "multiplicative" && hit.unit === "percent") {
		const v = Number(val) / 100;
		value_signed = hit.sign === "positive" ? +v : -v;
	} else if (hit.kind === "additive" && hit.unit === "absolute") {
		const v = Number(val);
		value_signed = hit.sign === "positive" ? +v : -v;
	} else {
		// Fallback: just pass-through number
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
	const mods = JSON.parse(readFileSync(MODS_SRC, "utf-8")) as any[];
	const metrics = JSON.parse(readFileSync(METRICS_PATH, "utf-8")) as Metrics;
	const index = buildModsMappingIndex(metrics);

	const preview = mods.map((mod) => {
		const modsObj = mod.stat_modifiers || {};
		const mapped = Object.entries(modsObj).map(([k, v]) =>
			mapModifier(String(k), Number(v), index)
		);
		const known = mapped.filter((m) => m.found);
		const unknown = mapped.filter((m) => !m.found);

		return {
			id: mod.id,
			name: mod.name,
			// raw
			raw_stat_modifiers: modsObj,
			// normalized representation
			normalized_modifiers: known,
			// any keys not in mapping to help you extend the catalog
			unmapped: unknown,
		};
	});

	ensureDir(OUT_DIR);
	writeFileSync(OUT_PATH, JSON.stringify(preview, null, 2), "utf-8");
	console.log("Wrote preview:", OUT_PATH);

	// Diagnostics: list unique unmapped keys with index presence flags
	const allUnknown = preview.flatMap((p) => p.unmapped as any[]);
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
		console.log("Unmapped keys summary:");
		for (const [k, info] of entries) {
			console.log(
				`  - ${k} (slug: ${info.hint_slug}) | byRaw: ${info.index_has_raw}, bySlug: ${info.index_has_slug}, occurrences: ${info.count}`
			);
		}
		console.log(
			"Hints: Ensure entries are under metrics.mods[], exact key_raw or correct key_slug, and that the file is saved before running."
		);
	} else {
		console.log("All modifier keys mapped successfully.");
	}
})();
