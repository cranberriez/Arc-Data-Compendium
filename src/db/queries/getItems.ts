import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { items } from "../schema";

export const getItems = ({ id }: { id?: string } = {}) => {
	return db.query.items.findMany({
		where: id ? eq(items.id, id) : undefined,
		with: {
			weapon: {
				columns: { id: false, itemId: false },
				with: {
					weaponStats: true,
					upgrades: { with: { upgradeStats: true } },
				},
			},
			recipe: { with: { io: true, locks: true } },
			recycling: { with: { io: true } },
			questEntries: {
				with: {
					questEntry: {
						columns: {
							type: true,
						},
					},
				},
			},
			workbenchRequirements: true,
		},
	});
};

export const getWeapons = ({ id }: { id?: string } = {}) => {
	return db.query.items.findMany({
		where: id ? eq(items.id, id) : eq(items.category, "weapon"),
		with: {
			weapon: {
				columns: { id: false, itemId: false },
				with: {
					weaponStats: true,
					upgrades: { with: { upgradeStats: true } },
				},
			},
			recipe: { with: { io: true, locks: true } },
			recycling: { with: { io: true } },
			questEntries: {
				with: {
					questEntry: {
						columns: {
							type: true,
						},
					},
				},
			},
			workbenchRequirements: true,
		},
	});
};
