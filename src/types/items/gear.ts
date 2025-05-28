// Quick use data for items that can be used, thrown, or consumed
export interface GearData {
	category: GearCategory;
	stats?: GearStat;
}

// Intended use for the quick_use item
export type GearCategory = "shield" | "augment";

export type AugmentTier = 0 | 1 | 2 | 3;

export type Segments = 5 | 8 | 12;

// Stats for quick use items
export type GearStat =
	| {
			shieldCharge: number;
			damageMitigation: number; // damage reduced percentage, represented as a decimal
			movePenalty: number; // movement penalty percentage, represented as a decimal
			segments: Segments;
			minimumTier: AugmentTier;
	  }
	| {
			backpackSlots: number; // total number of backpack slots
			weightLimit: number; // total weight limit in kilograms
			safePocketSize: number; // number of items that can be stored in the safe pocket
			quickUseSlots: number; // number of quick use slots
			weaponSlots: number; // number of weapon slots
			tier: AugmentTier;
	  };
