import { db } from "../src/db/drizzle"; // your db instance
import {
	items,
	requiredItem,
	upgrade,
	upgradeStats,
	weaponStats,
	weapons,
} from "../src/db/schema/items";
import itemData from "../src/data/items/itemData.json";

// 1. Read and (optionally) validate/transform data
// 2. Loop and insert
async function seedItems() {
	let requiredItemsToInsert: any[] = [];

	for (const item of itemData) {
		try {
			await db
				.insert(items)
				.values({
					id: item.id,
					name: item.name,
					category: item.category,
					icon: item.icon,
					rarity: item.rarity,
					description: item.description,
					weight: item.weight,
					maxStack: item.maxStack,
					recipeId: item.recipeId,
					value: item.value,
					quickUse: item.quickUse,
					gear: item.gear,
					flavorText: item.flavorText,
				} as any)
				.onConflictDoNothing();
		} catch (err) {
			console.error("Failed to insert item:", item, err);
		}

		if (item.recycling && item.recycling.length > 0) {
			requiredItemsToInsert.push(
				...item.recycling.map(
					(r) =>
						({
							itemId: r.id,
							count: r.count,
							consumerType: "recycle",
							consumerId: item.id,
						} as any)
				)
			);
		}

		if (item.sub_type === "weapon") {
			await db
				.insert(weapons)
				.values({
					itemId: item.id,
					ammoType: item.ammo_type,
					weaponClass: item.weapon_class,
					modSlots: item.mod_slots,
					compatibleMods: item.compatible_mods,
					baseTier: item.base_tier,
					maxLevel: item.max_level,
				} as any)
				.onConflictDoNothing();

			await db
				.insert(weaponStats)
				.values({
					itemId: item.id,
					statUsage: "base",
					damage: item.stats?.damage || -1,
					fireRate: item.stats?.fire_rate || -1,
					range: item.stats?.range || -1,
					stability: item.stats?.stability || -1,
					agility: item.stats?.agility || -1,
					stealth: item.stats?.stealth || -1,
					durabilityBurn: item.stats?.durability_burn || -1,
					magazineSize: item.stats?.magazine_size || -1,
				} as any)
				.onConflictDoNothing();
		}

		if (item.upgrade_effects && item.upgrade_effects.length > 0) {
			item.upgrade_effects.map(async (upgradeEffect, idx) => {
				await db
					.insert(upgrade)
					.values({
						itemId: item.id,
						level: idx + 1,
					} as any)
					.onConflictDoNothing();

				Object.entries(upgradeEffect).map(async ([stat, value]) => {
					await db
						.insert(upgradeStats)
						.values({
							upgradeItemId: item.id,
							upgradeItemLevel: idx + 1,
							statType: stat,
							modifierType: "additive",
							value: value,
						} as any)
						.onConflictDoNothing();
				});
			});
		}
	}

	await db.insert(requiredItem).values(requiredItemsToInsert).onConflictDoNothing();
}

seedItems();
