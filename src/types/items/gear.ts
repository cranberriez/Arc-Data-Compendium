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
			shield_charge: number;
			damage_mitigation: number; // damage reduced percentage, represented as a decimal
			move_penalty: number; // movement penalty percentage, represented as a decimal
			segments: Segments;
			minimumTier: AugmentTier;
	  }
	| {
			backpack_slots: number; // total number of backpack slots
			weight_limit: number; // total weight limit in kilograms
			safe_pocket_size: number; // number of items that can be stored in the safe pocket
			quick_use_slots: number; // number of quick use slots
			weapon_slots: number; // number of weapon slots
			tier: AugmentTier;
	  };
