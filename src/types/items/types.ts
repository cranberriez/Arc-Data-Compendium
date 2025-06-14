// Re-export types from the documentation

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemSourceType = "drop" | "buy" | "quest" | "found" | "event" | "craft";

export type ItemCategory =
	| "recyclable"
	| "trinket"
	| "quick_use"
	| "ammo"
	| "weapon"
	| "gear"
	| "misc"
	| "topside_material"
	| "refined_material";

export type ShieldType = "light" | "medium" | "heavy";

export type TraderName = "Tian Wen" | "Lance" | "Apollo" | "Shani";

export type ItemSource =
	| {
			type: "buy";
			trader: TraderName;
			value: number;
			count?: number;
	  }
	| {
			type: "recycle";
			fromItemId: string; // The item being recycled to produce this item
			count: number;
	  };

/**
 * Recycling structure for items that can be recycled into other items
 */
export interface Recycling {
	/** ID of the resulting item (item_id) */
	id: string;
	/** Number of items produced */
	count: number;
}
