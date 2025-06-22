import { db } from "../src/db/drizzle"; // your db instance
import workbenchData from "../src/data/workbenches/workbenchData.json";
import { tierRequirements, tiers, workbenches } from "../src/db/schema";

export async function seedWorkbenches() {
	console.log("[seedWorkbenches] Starting workbench seeding process...");
	const typedWorkbenchData: any[] = workbenchData;

	for (const workbench of typedWorkbenchData) {
		console.log(
			`[seedWorkbenches][ACTIVE] Seeding workbench: ${workbench.id} - ${workbench.name}`
		);
		try {
			await db
				.insert(workbenches)
				.values({
					id: workbench.id,
					name: workbench.name,
					description: workbench.description,
					icon: workbench.icon,
					baseTier: workbench.baseTier,
					raidsRequired: workbench.tiers[0]?.raidsRequired ?? 0,
				} as any)
				.onConflictDoNothing();
			console.log(
				`[seedWorkbenches][SUCCESS] Inserted workbench: ${workbench.id} - ${workbench.name}`
			);
		} catch (err) {
			console.error("Failed to insert workbench:", workbench, err);
			return;
		}

		// seed workbench tiers
		for (const tier of workbench.tiers) {
			console.log(
				`[seedWorkbenches][ACTIVE] Inserting workbench tier for workbench: ${workbench.id}, tier: ${tier.tier}`
			);
			try {
				await db
					.insert(tiers)
					.values({
						workbenchId: workbench.id,
						tier: tier.tier,
						tierName: tier.tierName ?? "",
					} as any)
					.onConflictDoUpdate({
						target: [tiers.workbenchId, tiers.tier],
						set: { tierName: tier.tierName ?? "" },
					});
				console.log(
					`[seedWorkbenches][SUCCESS] Inserted workbench tier for workbench: ${workbench.id}, tier: ${tier.tier}`
				);
			} catch (err) {
				console.error("Failed to insert workbench tier:", workbench, tier, err);
				return;
			}

			// seed tier requirements
			for (const requirement of tier.requiredItems) {
				console.log(
					`[seedWorkbenches][ACTIVE] Inserting tier requirement for workbench: ${workbench.id}, tier: ${tier.tier}, requirement: ${requirement.itemId}`
				);
				try {
					await db
						.insert(tierRequirements)
						.values({
							workbenchId: workbench.id,
							workbenchTier: tier.tier,
							itemId: requirement.itemId,
							count: requirement.count,
						} as any)
						.onConflictDoNothing();
					console.log(
						`[seedWorkbenches][SUCCESS] Inserted tier requirement for workbench: ${workbench.id}, tier: ${tier.tier}, requirement: ${requirement.itemId}`
					);
				} catch (err) {
					console.error(
						"Failed to insert tier requirement:",
						workbench,
						tier,
						requirement,
						err
					);
					return;
				}
			}
		}
	}
}

seedWorkbenches();
