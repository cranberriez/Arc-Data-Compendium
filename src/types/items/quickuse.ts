// Quick use data for items that can be used, thrown, or consumed
export interface QuickUseData {
	category: QuickUseCategory;
	stats?: QuickUseStat[];
	charge?: QuickUseCharge;
}

// Intended use for the quick_use item
export type QuickUseCategory = "healing" | "throwable" | "trap" | "utility";

// Stats for quick use items
export interface QuickUseStat {
	name: string;
	value?: number;
	perSecond?: boolean; // is this damage over time (value/second)
	duration?: number; // duration a per second effect lasts
	effect?: string; // the effect this applies over time (e.g. "stamina drain" = stamina drain for duration)
}

// Charge data for quick use items
export type QuickUseCharge =
	| {
			type: "per_use";
			maxCharges: number;
			chargeCost: number; // charge used per use
			rechargeRate: number; // charge per second
	  }
	| {
			type: "usage_bar";
			maxCharges: number;
			drainRate: number; // charge consumed per second while in use
			rechargeRate: number; // charge per second when not in use
	  };
