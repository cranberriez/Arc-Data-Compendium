import { db } from "../src/db/drizzle"; // your db instance
import questData from "../src/data/quests/questData.json";
import { quests, questEntries, questEntryItems, questLinks } from "../src/db/schema";
import { eq } from "drizzle-orm";

export async function seedQuests() {
	console.log("[seedQuests] Starting quest seeding process...");
	const typedQuestData: any[] = questData;
	let missingItems: string[] = [];

	let questRelations: { previous: string; next: string }[] = [];

	// seed quests
	for (const quest of typedQuestData) {
		console.log(`[seedQuests][ACTIVE] Seeding quest: ${quest.id} - ${quest.name}`);
		try {
			await db
				.insert(quests)
				.values({
					id: quest.id,
					name: quest.name,
					trader: quest.trader,
					dialog: quest.dialog,
					location: quest.location || "",
					link: quest.link || "",
				} as any)
				.onConflictDoNothing();
			console.log(`[seedQuests][SUCCESS] Inserted quest: ${quest.id} - ${quest.name}`);
		} catch (err) {
			console.error("Failed to insert quest:", quest, err);
			return;
		}

		// seed quest entries
		let taskDescriptions: string[] = [];
		let itemRequirements: { itemId: string; count: number }[] = [];
		let itemRewards: { itemId: string; count: number }[] = [];
		let questXp: number = 0;

		for (const entry of quest.requirements) {
			taskDescriptions.push(entry.description);

			// add links with type item to item requirements
			const count = entry?.count ?? 1;
			for (const link of entry.links ?? []) {
				if (link.type === "item") {
					itemRequirements.push({
						itemId: link.id,
						count: count,
					});
				}
			}
		}

		for (const entry of quest.rewards) {
			// add links with type item to item rewards
			const count = entry?.count ?? 1;
			for (const link of entry.links ?? []) {
				if (link.type === "item") {
					itemRewards.push({
						itemId: link.id,
						count: count,
					});
				}
			}
			// add links with type xp to quest xp
			if (entry.description === "XP") {
				questXp += entry.count ?? 0;
			}
		}

		// Xp Add Logic
		try {
			await db.update(quests).set({ xpReward: questXp }).where(eq(quests.id, quest.id));
		} catch (err) {
			console.error("Failed to update quest xp:", quest.id, err);
			return;
		}

		// Requirements logic
		let reqEntryId: number | null = null;
		try {
			console.log(`[seedQuests][ACTIVE] Inserting quest entry for quest: ${quest.id}`);
			const result = await db
				.insert(questEntries)
				.values({
					questId: quest.id,
					type: "objective",
					description: taskDescriptions.join("\n"),
				} as any)
				.onConflictDoUpdate({
					target: [questEntries.questId, questEntries.type],
					set: { description: taskDescriptions.join("\n") },
				})
				.returning({ id: questEntries.id });
			reqEntryId = result[0].id;
			console.log(
				`[seedQuests][SUCCESS] Inserted quest entry for quest: ${quest.id}, entryId: ${reqEntryId}`
			);
		} catch (err) {
			console.error("Failed to insert quest entry:", err);
			return;
		}

		// seed item requirements
		for (const itemRequirement of itemRequirements) {
			console.log(
				`[seedQuests][ACTIVE] Inserting quest entry item for quest: ${quest.id}, entryId: ${reqEntryId}, itemId: ${itemRequirement.itemId}`
			);
			if (!reqEntryId) {
				console.error("Failed to insert quest entry item:", quest.id, itemRequirement);
				continue;
			}

			try {
				await db
					.insert(questEntryItems)
					.values({
						questEntryId: reqEntryId,
						itemId: itemRequirement.itemId,
						count: itemRequirement.count,
					} as any)
					.onConflictDoNothing();
				console.log(
					`[seedQuests][SUCCESS] Inserted quest entry item for quest: ${quest.id}, entryId: ${reqEntryId}, itemId: ${itemRequirement.itemId}`
				);
			} catch (err) {
				console.error("Failed to insert quest entry item:", quest.id, itemRequirement, err);
				missingItems.push(itemRequirement.itemId);
			}
		}

		// Rewards Logic
		let rewardEntryId: number | null = null;
		try {
			console.log(`[seedQuests][ACTIVE] Inserting quest entry for quest: ${quest.id}`);
			const result = await db
				.insert(questEntries)
				.values({
					questId: quest.id,
					type: "reward",
				} as any)
				.onConflictDoUpdate({
					target: [questEntries.questId, questEntries.type],
					set: { type: "reward" },
				})
				.returning({ id: questEntries.id });
			rewardEntryId = result[0].id;
			console.log(
				`[seedQuests][SUCCESS] Inserted quest entry for quest: ${quest.id}, entryId: ${rewardEntryId}`
			);
		} catch (err) {
			console.error("Failed to insert quest entry:", err);
			return;
		}

		// seed item rewards
		for (const itemReward of itemRewards) {
			console.log(
				`[seedQuests][ACTIVE] Inserting quest entry item for quest: ${quest.id}, entryId: ${rewardEntryId}, itemId: ${itemReward.itemId}`
			);
			if (!rewardEntryId) {
				console.error("Failed to insert quest entry item:", quest.id, itemReward);
				continue;
			}

			try {
				await db
					.insert(questEntryItems)
					.values({
						questEntryId: rewardEntryId,
						itemId: itemReward.itemId,
						count: itemReward.count,
					} as any)
					.onConflictDoNothing();
				console.log(
					`[seedQuests][SUCCESS] Inserted quest entry item for quest: ${quest.id}, entryId: ${rewardEntryId}, itemId: ${itemReward.itemId}`
				);
			} catch (err) {
				console.error("Failed to insert quest entry item:", quest.id, itemReward, err);
				missingItems.push(itemReward.itemId);
			}
		}

		// Add quest relationships
		for (const previous of quest.prereq ?? []) {
			questRelations.push({ previous, next: quest.id });
		}

		for (const next of quest.next ?? []) {
			questRelations.push({ previous: quest.id, next });
		}
	}

	// seed quest relationships
	try {
		console.log("[seedQuests][ACTIVE] Inserting quest relationships");
		await db.insert(questLinks).values(questRelations).onConflictDoNothing();
		console.log("[seedQuests][SUCCESS] Inserted quest relationships");
	} catch (err) {
		console.error("Failed to insert quest relationships:", err);
		return;
	}

	console.log("Missing items:", missingItems);
	return missingItems;
}

seedQuests();
