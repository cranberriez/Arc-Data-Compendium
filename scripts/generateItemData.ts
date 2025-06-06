const fs = require("fs");
const path = require("path");

// Load raw data
const items = require("../src/data/items/itemData.json");
const workbenches = require("../src/data/workbenches/workbenchData.json");
const recipes = require("../src/data/recipes/recipeData.json");

// Helper: compute uses for an item
function computeUses(itemId: string) {
	const uses = [];

	// Workbenches (search all tiers)
	for (const wb of workbenches) {
		if (Array.isArray(wb.tiers)) {
			for (const tier of wb.tiers) {
				if (Array.isArray(tier.requiredItems)) {
					for (const req of tier.requiredItems) {
						if (req.itemId === itemId) {
							uses.push({
								type: "workbench",
								id: wb.id,
								name: wb.name,
								extra: { tier: tier.tier },
							});
						}
					}
				}
			}
		}
	}

	// Recipes (requirements)
	for (const recipe of recipes) {
		if (Array.isArray(recipe.requirements)) {
			for (const req of recipe.requirements) {
				if (req.itemId === itemId) {
					uses.push({ type: "recipe", id: recipe.id, name: recipe.outputItemId });
				}
			}
		}
	}

	// Add more use types here as needed

	return uses;
}

// Enrich items
const enrichedItems = items.map((item: any) => {
	const uses = computeUses(item.id);
	if (uses.length > 0) {
		return {
			...item,
			uses,
		};
	}
	return item;
});

// Output path (overwrite the same file for simplicity)
const outputPath = path.join(__dirname, "../src/data/items/itemData.build.json");
fs.writeFileSync(outputPath, JSON.stringify(enrichedItems, null, 2));
console.log("Enriched item data written to", outputPath);
