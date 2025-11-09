import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const FILE = join(ROOT, 'scripts', 'data', 'stat_mapping_metrics.json');

(function main() {
  const raw = readFileSync(FILE, 'utf-8');
  const data = JSON.parse(raw) as { mods?: any[]; upgrades?: any[] };

  if (!Array.isArray(data.mods)) {
    console.error('No mods array found in stat_mapping_metrics.json');
    process.exit(1);
  }

  data.mods.sort((a, b) => {
    const ka = String(a?.normalized ?? '').toLowerCase();
    const kb = String(b?.normalized ?? '').toLowerCase();
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    // fallback: by key_slug then key_raw for stable ordering
    const sa = String(a?.key_slug ?? '');
    const sb = String(b?.key_slug ?? '');
    if (sa < sb) return -1;
    if (sa > sb) return 1;
    const ra = String(a?.key_raw ?? '');
    const rb = String(b?.key_raw ?? '');
    return ra.localeCompare(rb);
  });

  writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('Sorted mods by normalized key in', FILE);
})();
