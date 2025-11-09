// Enum for ammo type
export type AmmoType = "light" | "medium" | "heavy" | "shotgun" | "energy" | "launcher";

// Enum for weapon class
export type WeaponClass =
	| "assault_rifle"
	| "battle_rifle"
	| "smg"
	| "shotgun"
	| "pistol"
	| "light_machinegun"
	| "sniper_rifle"
	| "special";

// Enum for mod slots
export type WeaponModSlot = "muzzle" | "grip" | "magazine" | "stock" | "tech";

// Interface for compatible mods
export type CompatibleMods = {
	[slot in WeaponModSlot]?: string[];
};

// Canonical weapon stat entry (used for base stats and modifier perks)
export type WeaponStatEntry = {
	kind: "additive" | "multiplicative";
	unit: "percent" | "absolute";
	value: number;
};

// Canonical stats object keyed by normalized metric name
export type WeaponStatsCanonical = Record<string, WeaponStatEntry>;

// For clarity in usage sites
export type WeaponBaseStats = WeaponStatsCanonical;
export type WeaponModifierStats = WeaponStatsCanonical;
