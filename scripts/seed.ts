import { db } from "../src/db/drizzle"; // Your Drizzle DB instance
import { workbenches, workbenchTiers, workbenchTierRequiredItems } from "../src/db/schema";
import workbenchesJson from "../src/data/workbenches/workbenchData.json"; // Adjust path to your JSON
import { Workbench } from "../src/types/items/workbench";

async function seed() {
	console.log("Seeding workbenches...");
	for (const wb of workbenchesJson as Workbench[]) {
		// Insert workbench
		await db.insert(workbenches).values({
			id: wb.id,
			name: wb.name,
			description: wb.description,
			icon: wb.icon,
			type: wb.type,
			baseTier: wb.baseTier,
		});

		// Insert each tier
		for (const tier of wb.tiers) {
			const tierResult = await db
				.insert(workbenchTiers)
				.values({
					workbenchId: wb.id,
					tier: tier.tier,
					tierName: tier.tierName,
					raidsRequired: tier.raidsRequired,
				})
				.returning({ id: workbenchTiers.id });

			const tierId = tierResult[0]?.id;
			if (tierId && tier.requiredItems) {
				// Insert required items for this tier
				for (const req of tier.requiredItems) {
					await db.insert(workbenchTierRequiredItems).values({
						workbenchTierId: tierId,
						itemId: req.itemId,
						count: req.count,
					});
				}
			}
		}
	}
	console.log("Seeding workbenches complete!");
}

seed().catch(console.error);
