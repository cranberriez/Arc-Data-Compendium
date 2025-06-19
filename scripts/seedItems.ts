import { db } from "../src/db/drizzle"; // your db instance
import {
	AmmoType,
	WeaponClass,
	items,
	upgrade,
	upgradeStats,
	weaponStats,
	weapons,
} from "../src/db/schema/items";
import itemData from "../src/data/items/itemData.json";
import { recipeItems, recipes } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { StatType, WeaponModSlot } from "@/types";

// 1. Read and (optionally) validate/transform data
// 2. Loop and insert
export async function seedItems() {
	// seed recycling as recipes
	let recyclingRecipes: any[] = [];
	let recyclingIO: any[] = [];

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
					recipeId: null, // Updated later when recipe is added
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
			recyclingRecipes.push({
				id: "recycle_" + item.id,
				type: "recycling",
			} as any);

			recyclingIO.push(
				...item.recycling.map(
					(r) =>
						({
							recipeId: "recycle_" + item.id,
							itemId: r.id,
							role: "output",
							qty: r.count,
						} as any)
				)
			);

			recyclingIO.push(
				...item.recycling.map(
					(r) =>
						({
							recipeId: "recycle_" + item.id,
							itemId: item.id,
							role: "input",
							qty: 1,
						} as any)
				)
			);
		}

		// seed weapon data
		let curWeapon: any;
		if (item.sub_type === "weapon") {
			curWeapon = await db
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
				.onConflictDoUpdate({
					target: [weapons.itemId],
					set: {
						ammoType: item.ammo_type as AmmoType,
						weaponClass: item.weapon_class as WeaponClass,
						modSlots: item.mod_slots as WeaponModSlot[],
						compatibleMods: item.compatible_mods as string[],
						baseTier: item.base_tier,
						maxLevel: item.max_level,
					},
				})
				.returning({ id: weapons.id });

			await db
				.insert(weaponStats)
				.values({
					weaponId: curWeapon[0].id,
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

		// seed upgrade stats
		if (item.upgrade_effects && item.upgrade_effects.length > 0) {
			item.upgrade_effects.map(async (upgradeEffect, idx) => {
				const curUpgrade = await db
					.insert(upgrade)
					.values({
						weaponId: curWeapon[0].id,
						level: idx + 1,
					} as any)
					.onConflictDoUpdate({
						target: [upgrade.weaponId, upgrade.level],
						set: {
							weaponId: curWeapon[0].id,
							level: idx + 1,
						},
					})
					.returning({ id: upgrade.id });

				Object.entries(upgradeEffect).map(async ([stat, value]) => {
					await db
						.insert(upgradeStats)
						.values({
							upgradeId: curUpgrade[0].id,
							statType: stat as StatType,
							modifierType: "additive",
							value: value as number,
						} as any)
						.onConflictDoNothing();
				});
			});
		}
	}

	// seed recycling as recipes
	await db.insert(recipes).values(recyclingRecipes).onConflictDoNothing();
	await db.insert(recipeItems).values(recyclingIO).onConflictDoNothing();

	// update recycling id for items AFTER recipe is created
	for (const item of recyclingRecipes) {
		await db.update(items).set({ recipeId: item.id }).where(eq(items.id, item.id));
	}
}

seedItems();
