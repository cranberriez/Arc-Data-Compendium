// Quick use data for items that can be used, thrown, or consumed
export interface GearData {
	category: GearCategory;
	stats?: GearStat;
}

// Intended use for the quick_use item
export type GearCategory = "shield" | "augment";

export type ShieldTypes = "light" | "medium" | "heavy";

// Stats for quick use items
export type GearStat =
	| {
			shieldCharge: number;
			damageMitigation: number; // damage reduced percentage, represented as a decimal
			movePenalty: number; // movement penalty percentage, represented as a decimal
			segments: number;
			shieldType: ShieldTypes;
	  }
	| {
			backpackSlots: number; // total number of backpack slots
			weightLimit: number; // total weight limit in kilograms
			safePocketSize: number; // number of items that can be stored in the safe pocket
			quickUseSlots: number; // number of quick use slots
			weaponSlots: number; // number of weapon slots
			supportedShieldTypes: ShieldTypes[];
	  };
