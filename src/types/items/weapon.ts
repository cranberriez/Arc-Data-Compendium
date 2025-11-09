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

// Canonical weapon stat entry (used for modifier perks)
export type WeaponStatEntry = {
	kind: "additive" | "multiplicative";
	unit: "percent" | "absolute";
	value: number;
};

// Canonical modifier stats object keyed by normalized metric name
export type WeaponStatsCanonical = Record<string, WeaponStatEntry>;

// Base stats stored on weapons.stats_base as simple raw JSON
// Numeric stats are numbers; categorical stats are strings (e.g., firing_mode)
export interface WeaponBaseStats {
	// Core numeric combat stats
	damage?: number;
	fire_rate?: number;
	range?: number;
	stability?: number;
	agility?: number;
	stealth?: number;

	// Common weapon numerics
	magazine_size?: number;
	reload_time?: number;
	bullet_velocity?: number;
	recoil_horizontal?: number;
	recoil_vertical?: number;

	// Categorical/base descriptors
	firing_mode?: string;
	arc_armor_penetration?: string;
}

export type WeaponModifierStats = WeaponStatsCanonical;
