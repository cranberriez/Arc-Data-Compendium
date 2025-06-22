// Enum for ammo type
export type AmmoType = "light" | "medium" | "heavy" | "shotgun" | "energy";

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
export type WeaponModSlot = "barrel" | "grip" | "magazine" | "stock" | "tech";

// Interface for compatible mods
export type CompatibleMods = {
	[slot in WeaponModSlot]?: string[];
};
