import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Input paths
const ROOT = process.cwd();
const MODS_PATH = join(ROOT, 'scripts', 'data', 'modification_items_enriched.json');
const WEAPONS_PATH = join(ROOT, 'scripts', 'data', 'weapon_items_enriched.json');

// Output paths
const OUT_DIR = join(ROOT, 'scripts', 'data', '_generated');
const SUMMARY_PATH = join(OUT_DIR, 'stat_keys_summary.json');
const SCAFFOLD_PATH = join(OUT_DIR, 'stats_mapping_scaffold.json');

// Helpers
function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/__+/g, '_');
}

function classifyUpgradeKey(raw: string) {
  // *_pct -> multiplicative percentage (value/100)
  // *_plus -> additive absolute
  if (raw.endsWith('_pct')) {
    return { normalized: raw.replace(/_pct$/, ''), kind: 'multiplicative', unit: 'percent' } as const;
  }
  if (raw.endsWith('_plus')) {
    return { normalized: raw.replace(/_plus$/, ''), kind: 'additive', unit: 'absolute' } as const;
  }
  return { normalized: raw, kind: 'unknown', unit: 'unknown' } as const;
}

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

// Main
(function main() {
  const modsRaw = JSON.parse(readFileSync(MODS_PATH, 'utf-8')) as any[];
  const weaponsRaw = JSON.parse(readFileSync(WEAPONS_PATH, 'utf-8')) as any[];

  const modKeyStats: Record<string, { count: number; examples: number[]; min: number; max: number } > = {};
  const modKeySamples: Record<string, Set<string>> = {};

  for (const mod of modsRaw) {
    const sm = mod.stat_modifiers || {};
    for (const [k, v] of Object.entries(sm)) {
      const key = String(k);
      const val = typeof v === 'number' ? v : Number(v);
      if (!modKeyStats[key]) {
        modKeyStats[key] = { count: 0, examples: [], min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
        modKeySamples[key] = new Set<string>();
      }
      const s = modKeyStats[key];
      s.count += 1;
      if (Number.isFinite(val)) {
        s.examples.push(val);
        s.min = Math.min(s.min, val);
        s.max = Math.max(s.max, val);
      }
      // capture a few ids for context
      if (mod.id) {
        if (modKeySamples[key].size < 5) modKeySamples[key].add(String(mod.id));
      }
    }
  }

  const upgradeKeyStats: Record<string, { count: number; examples: number[]; min: number; max: number; kind: string; unit: string; normalized: string } > = {};
  const upgradeKeySamples: Record<string, Set<string>> = {};

  for (const w of weaponsRaw) {
    const upgrades = Array.isArray(w.upgrades) ? w.upgrades : [];
    for (const up of upgrades) {
      const perks = up.perks || {};
      for (const [k, v] of Object.entries(perks)) {
        const key = String(k);
        const val = typeof v === 'number' ? v : Number(v);
        const cls = classifyUpgradeKey(key);
        if (!upgradeKeyStats[key]) {
          upgradeKeyStats[key] = { count: 0, examples: [], min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, kind: cls.kind, unit: cls.unit, normalized: cls.normalized };
          upgradeKeySamples[key] = new Set<string>();
        }
        const s = upgradeKeyStats[key];
        s.count += 1;
        if (Number.isFinite(val)) {
          s.examples.push(val);
          s.min = Math.min(s.min, val);
          s.max = Math.max(s.max, val);
        }
        if (w.id) {
          if (upgradeKeySamples[key].size < 5) upgradeKeySamples[key].add(String(w.id));
        }
      }
    }
  }

  // Build summary output
  const summary = {
    mods: Object.entries(modKeyStats).map(([key, s]) => ({
      key,
      key_slug: toSlug(key),
      count: s.count,
      min: Number.isFinite(s.min) ? s.min : null,
      max: Number.isFinite(s.max) ? s.max : null,
      sample_values: s.examples.slice(0, 5),
      sample_items: Array.from(modKeySamples[key] || []),
      percent_guess: s.max != null && Number.isFinite(s.max) && s.max <= 100 && s.min >= 0,
    })),
    upgrades: Object.entries(upgradeKeyStats).map(([key, s]) => ({
      key,
      normalized_key: s.normalized,
      kind: s.kind,
      unit: s.unit,
      count: s.count,
      min: Number.isFinite(s.min) ? s.min : null,
      max: Number.isFinite(s.max) ? s.max : null,
      sample_values: s.examples.slice(0, 5),
      sample_weapons: Array.from(upgradeKeySamples[key] || []),
    })),
  };

  // Build scaffold mapping the team can curate
  const scaffold = {
    mods: summary.mods.map(m => ({
      key_raw: m.key,
      key_slug: m.key_slug,
      // editable field: final normalized key to convert to
      normalized: m.key_slug, // e.g., reduced_vertical_recoil
      kind: m.percent_guess ? 'multiplicative' : 'additive', // guess; please review
      unit: m.percent_guess ? 'percent' : 'absolute', // guess; please review
      // simplify sign to positive/negative for rendering/math/UI coloration
      sign: 'positive' as 'positive' | 'negative',
      notes: '',
    })),
    upgrades: summary.upgrades.map(u => ({
      key_raw: u.key,
      key_slug: toSlug(u.key),
      normalized: toSlug(u.normalized_key),
      kind: u.kind,
      unit: u.unit,
      sign: 'positive' as 'positive' | 'negative',
      notes: '',
    })),
  };

  ensureDir(OUT_DIR);
  writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), 'utf-8');
  writeFileSync(SCAFFOLD_PATH, JSON.stringify(scaffold, null, 2), 'utf-8');

  console.log('Wrote:', SUMMARY_PATH);
  console.log('Wrote:', SCAFFOLD_PATH);
})();
