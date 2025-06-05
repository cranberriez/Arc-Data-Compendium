import { Workbench } from "@/types";

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
export function getAllWorkbenchRequirements(workbenches: Workbench[]): WorkbenchRequirement[] {
	// Map to accumulate totals and per-tier counts for each itemId
	const itemMap: {
		[itemId: string]: { totalCount: number; perTier: { [tier: number]: number } };
	} = {};

	// Iterate over each workbench
	for (const workbench of workbenches) {
		if (!workbench.tiers) continue; // Skip if no tiers
		// Iterate over each tier in the workbench
		for (const tier of workbench.tiers) {
			if (!tier.requiredItems) continue; // Skip if no requiredItems
			// Iterate over each required item in the tier
			for (const req of tier.requiredItems) {
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
	}

	// Convert the map to an array of WorkbenchRequirement objects
	const result: WorkbenchRequirement[] = Object.entries(itemMap).map(([itemId, data]) => ({
		itemId,
		totalCount: data.totalCount,
		perTier: data.perTier,
	}));

	return result;
}

// Returns requirements for a specified tier range (inclusive) for the given workbenches.
// fromTier and toTier are inclusive bounds (e.g. fromTier=2, toTier=4 returns requirements for tiers 2, 3, and 4)
export function getWorkbenchRequirementsRange(
	workbenches: Workbench[],
	fromTier: number,
	toTier: number
): WorkbenchRequirement[] {
	const itemMap: {
		[itemId: string]: { totalCount: number; perTier: { [tier: number]: number } };
	} = {};

	for (const workbench of workbenches) {
		if (!workbench.tiers) continue;
		for (const tier of workbench.tiers) {
			if (!tier.requiredItems) continue;
			if (tier.tier < fromTier || tier.tier > toTier) continue;
			for (const req of tier.requiredItems) {
				if (!itemMap[req.itemId]) {
					itemMap[req.itemId] = { totalCount: 0, perTier: {} };
				}
				itemMap[req.itemId].totalCount += req.count;
				itemMap[req.itemId].perTier[tier.tier] =
					(itemMap[req.itemId].perTier[tier.tier] || 0) + req.count;
			}
		}
	}

	const result: WorkbenchRequirement[] = Object.entries(itemMap).map(([itemId, data]) => ({
		itemId,
		totalCount: data.totalCount,
		perTier: data.perTier,
	}));

	return result;
}
