import { readFile } from "fs/promises";
import path from "path";

interface ScrapedItem {
	verbose_category?: string;
	category_tags?: string[];
	found_in?: string[];
}

const DATA_DIR = path.resolve(process.cwd(), "scripts/data");
const FILES = [
	"arc_raiders_items_enriched.json",
	"augment_items_enriched.json",
	"grenade_items_enriched.json",
	"healing_items_enriched.json",
	"quick_use_items_enriched.json",
	"trap_items_enriched.json",
];

async function load(file: string): Promise<ScrapedItem[]> {
	const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
	return JSON.parse(raw) as ScrapedItem[];
}

async function main() {
	const categories = new Set<string>();
	const categoryTags = new Set<string>();
	const foundIn = new Set<string>();

	for (const f of FILES) {
		try {
			const items = await load(f);
			for (const it of items) {
				if (it.verbose_category) categories.add(it.verbose_category);
				if (Array.isArray(it.category_tags)) {
					for (const t of it.category_tags) if (t) categoryTags.add(t);
				}
				if (Array.isArray(it.found_in)) {
					for (const loc of it.found_in) if (loc) foundIn.add(loc);
				}
			}
		} catch (e) {
			console.error(`Failed reading ${f}:`, e);
		}
	}

	const toSortedArray = (s: Set<string>) => Array.from(s).sort((a, b) => a.localeCompare(b));

	console.log("\n=== Unique verbose_category values ===");
	console.log(toSortedArray(categories).join("\n"));

	console.log("\n=== Unique category_tags values ===");
	console.log(toSortedArray(categoryTags).join("\n"));

	console.log("\n=== Unique found_in values ===");
	console.log(toSortedArray(foundIn).join("\n"));
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
