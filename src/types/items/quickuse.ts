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
	duration?: number; // duration a per second effect lasts, alternate to value
	range?: number; // range of the item, alternate to value
	effect?: string; // the effect this applies over time (e.g. "stamina drain" = stamina drain for duration)
}

// Charge data for quick use items
export type QuickUseCharge =
	| {
			type: "per_use"; // represents an item that uses a limited amount of charges
			maxCharges: number; // max charges
			chargeCost: number; // charges used per use
			rechargeRate: number; // percent of max charge gained per second, represented as a decimal
	  }
	| {
			type: "usage_bar"; // represents an item that uses a usage bar and uses a percent of the bar per second when used
			maxCharges: number; // max charge (typically just 100 in this case)
			drainRate: number; // percent of max charge consumed per second while in use, represented as a decimal
			rechargeRate: number; // percent of max charge gained per second, represented as a decimal
	  };
