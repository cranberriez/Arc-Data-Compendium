import { Item } from "./item";

// Enum for ammo type
export type AmmoType = "light" | "medium" | "heavy" | "shotgun" | "energy";

// Enum for weapon class
export type WeaponClass =
	| "assault_rifle"
	| "battle_rifle"
	| "submachine_gun"
	| "shotgun"
	| "pistol"
	| "light_machinegun"
	| "sniper_rifle"
	| "special";

// Enum for mod slots
export type WeaponModSlot = "barrel" | "grip" | "magazine" | "stock" | "tech";

// Interface for compatible mods
export type CompatibleMods = {
	[slot in WeaponModSlot]?: string[];
};

// Interface for weapon usage stats
export interface WeaponStats {
	damage: number;
	fire_rate: number;
	range: number;
	stability: number;
	agility: number;
	stealth: number;
	durability_burn: number; // out of 100 per shot
	magazine_size: number;
}

// The Weapon type extends Item
export interface WeaponUpgrade {
	level: number;
	description?: string;
	stat_modifiers: Partial<{
		damage: number; // percent change, e.g. 0.1 for +10%
		fire_rate: number;
		range: number;
		stability: number;
		agility: number;
		stealth: number;
		durability_burn: number;
		magazine_size: number;
	}>;
}

export interface Weapon extends Item {
	sub_type: "weapon";
	weapon_class: WeaponClass;
	ammo_type: AmmoType;
	max_mods: number;
	stats: WeaponStats;
	mod_slots: WeaponModSlot[];
	compatible_mods: CompatibleMods;
	base_tier: number;
	max_level: number;
	upgrades: WeaponUpgrade[];
}
