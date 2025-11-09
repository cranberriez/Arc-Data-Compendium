import { readFile } from "fs/promises";
import path from "path";
import { db } from "../src/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
import { workbenches, tiers, tierRequirements } from "../src/db/schema/workbenches";
import { items } from "../src/db/schema/items";

interface WorkbenchTierReqs {
  [itemId: string]: number;
}

interface WorkbenchJson {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  base_tier: number;
  raids_required?: number;
  tiers: WorkbenchTierReqs[]; // index -> tier number (1-based)
  tier_names?: Record<string, string>; // only for scrappy
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const FILE = path.join(DATA_DIR, "workbenches.json");

async function readWorkbenches(): Promise<WorkbenchJson[]> {
  const raw = await readFile(FILE, "utf-8");
  return JSON.parse(raw) as WorkbenchJson[];
}

async function ensureItemsExist(ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const rows = await db.select({ id: items.id }).from(items).where(inArray(items.id, ids));
  return new Set(rows.map((r) => r.id));
}

function tierNameFor(idx1: number, names?: Record<string, string>) {
  const specific = names?.[String(idx1)]?.trim();
  if (specific) return specific;
  return `Tier ${idx1}`;
}

async function upsertWorkbench(wb: WorkbenchJson) {
  // Upsert workbench row
  const wbRow = {
    id: wb.id,
    name: wb.name,
    description: (wb.description ?? "").trim(),
    icon: wb.icon ?? "FileQuestion",
    baseTier: wb.base_tier,
    raidsRequired: wb.raids_required ?? 0,
  } as const;

  const existing = await db.select().from(workbenches).where(eq(workbenches.id, wb.id));
  if (existing.length === 0) {
    await db.insert(workbenches).values(wbRow);
  } else {
    await db.update(workbenches).set(wbRow).where(eq(workbenches.id, wb.id));
  }

  // Upsert tiers and their requirements
  for (let i = 0; i < wb.tiers.length; i++) {
    const tierNo = i + 1; // tiers are 1-based in data
    const tName = tierNameFor(tierNo, wb.tier_names);

    // Ensure tier row exists
    const tierExists = await db
      .select()
      .from(tiers)
      .where(and(eq(tiers.workbenchId, wb.id), eq(tiers.tier, tierNo)));
    if (tierExists.length === 0) {
      await db.insert(tiers).values({ workbenchId: wb.id, tier: tierNo, tierName: tName });
    } else if (tierExists[0].tierName !== tName) {
      await db
        .update(tiers)
        .set({ tierName: tName })
        .where(and(eq(tiers.workbenchId, wb.id), eq(tiers.tier, tierNo)));
    }

    // Replace requirements for this tier
    await db
      .delete(tierRequirements)
      .where(and(eq(tierRequirements.workbenchId, wb.id), eq(tierRequirements.workbenchTier, tierNo)));

    const reqs = wb.tiers[i] || {};
    const entries = Object.entries(reqs).filter(([, count]) => typeof count === "number" && count > 0);

    // Validate items exist
    const reqItemIds = entries.map(([id]) => id);
    const existingItems = await ensureItemsExist(reqItemIds);
    const values = entries
      .filter(([id]) => {
        const ok = existingItems.has(id);
        if (!ok) console.warn(`Skip requirement ${id} for ${wb.id} tier ${tierNo}: item not found`);
        return ok;
      })
      .map(([itemId, count]) => ({
        workbenchId: wb.id,
        workbenchTier: tierNo,
        itemId,
        count: count as number,
      }));

    if (values.length > 0) {
      await db.insert(tierRequirements).values(values);
    }
  }
}

async function main() {
  const benches = await readWorkbenches();
  let createdOrUpdated = 0;

  for (const wb of benches) {
    try {
      await upsertWorkbench(wb);
      createdOrUpdated++;
    } catch (e) {
      console.error(`Failed to upsert workbench ${wb.id}:`, e);
    }
  }

  console.log(`Processed ${createdOrUpdated} workbenches (rows upserted with tiers and requirements).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
