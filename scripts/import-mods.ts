import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const SRC_PATH = join(ROOT, 'scripts', 'data', 'modification_items_enriched.json');
const METRICS_PATH = join(ROOT, 'scripts', 'data', 'stat_mapping_metrics.json');
const OUT_DIR = join(ROOT, 'scripts', 'data', '_generated');
const OUT_PATH = join(OUT_DIR, 'mods_normalized.json');

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

type MappingEntry = {
  key_raw: string;
  key_slug: string;
  normalized: string;
  kind: 'additive' | 'multiplicative';
  unit: 'percent' | 'absolute';
  sign: 'positive' | 'negative';
};

type Metrics = {
  mods: MappingEntry[];
};

function toSlug(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/__+/g, '_');
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

function mapToCanonicalModifiers(rawMods: Record<string, number>, idx: ReturnType<typeof buildModsMappingIndex>) {
  const out: Record<string, { kind: 'additive' | 'multiplicative'; unit: 'percent' | 'absolute'; value: number }> = {};
  const unmapped: Array<{ raw_key: string; raw_value: number; hint_slug: string }> = [];
  for (const [key, val] of Object.entries(rawMods || {})) {
    const slug = toSlug(key);
    const hit = idx.byRaw.get(key) || idx.bySlug.get(slug);
    if (!hit) {
      unmapped.push({ raw_key: key, raw_value: Number(val), hint_slug: slug });
      continue;
    }
    let valueSigned: number;
    if (hit.kind === 'multiplicative' && hit.unit === 'percent') {
      const v = Number(val) / 100;
      valueSigned = hit.sign === 'positive' ? +v : -v;
    } else if (hit.kind === 'additive' && hit.unit === 'absolute') {
      const v = Number(val);
      valueSigned = hit.sign === 'positive' ? +v : -v;
    } else {
      valueSigned = Number(val);
    }
    out[hit.normalized] = { kind: hit.kind, unit: hit.unit, value: valueSigned };
  }
  return { canonical: out, unmapped };
}

function toLower(s?: string) {
  return (s || '').toLowerCase();
}

function detectSlotFromIcon(iconUrl?: string): string | null {
  if (!iconUrl) return null;
  const file = basename(iconUrl).toLowerCase();
  // Common patterns observed in data
  if (file.includes('underbarrel')) return 'grip';
  if (file.includes('muzzle')) return 'muzzle';
  if (file.includes('light-mag') || file.includes('medium-mag') || file.includes('shotgun-mag') || file.includes('mag')) return 'magazine';
  if (file.includes('stock')) return 'stock';
  return null;
}

function detectSlotHeuristic(id?: string, name?: string, iconUrl?: string): { slot: string | null; source: string } {
  const idL = toLower(id);
  const nameL = toLower(name);

  // Explicit exceptions from user notes
  if (idL === 'anvil_splitter' || nameL.includes('anvil splitter')) {
    return { slot: 'tech', source: 'explicit_exception' };
  }
  if (idL === 'kinetic_converter' || nameL.includes('kinetic converter')) {
    return { slot: 'stock', source: 'explicit_exception' };
  }

  // Heuristics by keywords
  if (nameL.includes('compensator') || idL.includes('compensator')) return { slot: 'muzzle', source: 'keyword' };
  if (nameL.includes('silencer') || idL.includes('silencer')) return { slot: 'muzzle', source: 'keyword' };
  if (nameL.includes('extended barrel') || idL.includes('extended_barrel')) return { slot: 'muzzle', source: 'keyword' };
  if (nameL.includes('choke') || idL.includes('choke')) return { slot: 'muzzle', source: 'keyword' };
  if (nameL.includes('muzzle') || idL.includes('muzzle')) return { slot: 'muzzle', source: 'keyword' };

  if (nameL.includes('grip') || idL.includes('grip') || nameL.includes('underbarrel') || idL.includes('underbarrel')) return { slot: 'grip', source: 'keyword' };

  if (nameL.includes('magazine') || idL.includes('magazine') || nameL.includes('mag ') || idL.includes('mag_') || idL.endsWith('_mag')) return { slot: 'magazine', source: 'keyword' };

  if (nameL.includes('stock') || idL.includes('stock')) return { slot: 'stock', source: 'keyword' };

  // Fallback to icon filename
  const iconSlot = detectSlotFromIcon(iconUrl);
  if (iconSlot) return { slot: iconSlot, source: 'icon' };

  return { slot: null, source: 'unknown' };
}

(function main() {
  const mods = JSON.parse(readFileSync(SRC_PATH, 'utf-8')) as any[];
  const metrics = JSON.parse(readFileSync(METRICS_PATH, 'utf-8')) as Metrics;
  const index = buildModsMappingIndex(metrics);

  const out: any[] = [];
  let counts: Record<string, number> = { muzzle: 0, grip: 0, magazine: 0, stock: 0, tech: 0, unknown: 0 };

  const diagnostics: Record<string, number> = {};
  for (const mod of mods) {
    const { slot, source } = detectSlotHeuristic(mod.id, mod.name, mod.category_icon || mod.image);
    const { canonical, unmapped } = mapToCanonicalModifiers(mod.stat_modifiers || {}, index);

    const normalized = {
      ...mod,
      slot,
      slot_detect_source: source,
      allowed_weapons: Array.isArray(mod.compatible_weapons) ? mod.compatible_weapons : [],
      modifiers: canonical,
    };

    out.push(normalized);
    counts[slot ?? 'unknown'] = (counts[slot ?? 'unknown'] || 0) + 1;
    for (const u of unmapped) diagnostics[u.raw_key] = (diagnostics[u.raw_key] || 0) + 1;
  }

  ensureDir(OUT_DIR);
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');

  // Also write a small report next to it
  const reportPath = join(OUT_DIR, 'mods_normalized.report.json');
  writeFileSync(reportPath, JSON.stringify({ counts, unmapped_keys: diagnostics }, null, 2), 'utf-8');

  console.log('Wrote:', OUT_PATH);
  console.log('Wrote:', reportPath);
})();
