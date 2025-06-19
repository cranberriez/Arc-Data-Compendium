import { db } from "@/db/drizzle";
import { items, weapons, weaponStats, upgrade, upgradeStats } from "@/db/schema/items";
import { eq } from "drizzle-orm";
import { Item } from "@/types";

export async function getItems(options?: {
	id?: string;
	category?: string;
}): Promise<Item[] | null> {
	try {
		let where = undefined;
		if (options?.id) {
			where = eq(items.id, options.id);
		} else if (options?.category) {
			where = eq(items.category, options.category as any);
		}

		const result = await db
			.select()
			.from(items)
			.where(where)
			.leftJoin(weapons, eq(items.id, weapons.itemId))
			.leftJoin(weaponStats, eq(weapons.id, weaponStats.weaponId));

		const itemsById = result.reduce<Record<string, Item>>((acc, row) => {
			const item = row.items;
			const weapon = row.weapons;
			const weaponStats = row.weapon_stats;
			// ...handle upgrades, recycling, etc. similarly

			if (!acc[item.id]) {
				acc[item.id] = {
					...item,
					weapon: weapon ?? undefined,
					weaponStats: weaponStats ?? undefined,
					// initialize upgrades, recycling, etc. as empty arrays or nulls as needed
					upgrades: [],
					recycling: [],
					recyclingSources: [],
					quickUse: null,
					gear: null,
				};
			}

			// If you have upgrades, recycling, etc., push to arrays here

			return acc;
		}, {});

		return Object.values(itemsById);
	} catch (error) {
		console.error("Error fetching items:", error);
		return null;
	}
}
