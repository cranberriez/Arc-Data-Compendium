import { Tier, WorkbenchRecipe } from "@/types";

export type WorkbenchRequirement = {
	itemId: string;
	totalCount: number;
	perTier: { [tier: number]: number };
};

// Flattens all requiredItems from all tiers of all workbenches into an array of objects
// Each object contains:
//   - itemId: the unique item identifier
//   - totalCount: total quantity required across all tiers
//   - perTier: an object mapping each tier number to the count needed for that tier
export function getAllWorkbenchRequirements(tiers: Tier[]): WorkbenchRequirement[] {
	// Map to accumulate totals and per-tier counts for each itemId
	const itemMap: {
		[itemId: string]: { totalCount: number; perTier: { [tier: number]: number } };
	} = {};

	for (const tier of tiers) {
		if (!tier.requirements) continue; // Skip if no requiredItems
		// Iterate over each required item in the tier
		for (const req of tier.requirements) {
			// Initialize entry for this itemId if not present
			if (!itemMap[req.itemId]) {
				itemMap[req.itemId] = { totalCount: 0, perTier: {} };
			}
			// Add to the total count for this itemId
			itemMap[req.itemId].totalCount += req.count;
			// Add to the count for this tier (sums if item appears multiple times in same tier)
			itemMap[req.itemId].perTier[tier.tier] =
				(itemMap[req.itemId].perTier[tier.tier] || 0) + req.count;
		}
	}

	// Convert the map to an array of WorkbenchRequirement objects
	const result: WorkbenchRequirement[] = Object.entries(itemMap).map(([itemId, data]) => ({
		itemId,
		totalCount: data.totalCount,
		perTier: data.perTier,
	}));

	return result;
}

export function groupWorkbenchRecipesByTier(recipes: WorkbenchRecipe[]): {
	[tier: number]: WorkbenchRecipe[];
} {
	const tierMap: { [tier: number]: WorkbenchRecipe[] } = {};
	for (const recipe of recipes) {
		if (!tierMap[recipe.workbenchTier]) {
			tierMap[recipe.workbenchTier] = [];
		}
		tierMap[recipe.workbenchTier].push(recipe);
	}
	return tierMap;
}
