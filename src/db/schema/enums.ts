import { pgEnum } from "drizzle-orm/pg-core";

// Item specific enums matching our TS types
const rarityValues = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type Rarity = (typeof rarityValues)[number];
export const rarityEnum = pgEnum("rarity", rarityValues);

const itemCategoryValues = [
	"recyclable",
	"trinket",
	"quick_use",
	"ammo",
	"weapon",
	"gear",
	"misc",
	"topside_material",
	"refined_material",
	"key",
] as const;
export type ItemCategory = (typeof itemCategoryValues)[number];
export const itemCategoryEnum = pgEnum("item_category", itemCategoryValues);

// Weapon specific enums
const ammoTypeValues = ["light", "medium", "heavy", "shotgun", "energy"] as const;
export const ammoTypeEnum = pgEnum("ammo_type", ammoTypeValues);
export type AmmoType = (typeof ammoTypeValues)[number];

const weaponClassValues = [
	"assault_rifle",
	"battle_rifle",
	"smg",
	"shotgun",
	"pistol",
	"light_machinegun",
	"sniper_rifle",
	"special",
] as const;
export const weaponClassEnum = pgEnum("weapon_class", weaponClassValues);
export type WeaponClass = (typeof weaponClassValues)[number];

// Stat enums for weapons and upgrades
// Because we store base stats and modifier stats in the same table, we need to know which is which
const statUsageValues = ["base", "modifier"] as const;
export const statUsageEnum = pgEnum("stat_usage", statUsageValues);
export type StatUsage = (typeof statUsageValues)[number];

// Upgrade type enums
const upgradeTypeValues = ["weapon", "mod"] as const;
export const upgradeTypeEnum = pgEnum("upgrade_type", upgradeTypeValues);
export type UpgradeType = (typeof upgradeTypeValues)[number];

// Stat types
const statTypeValues = [
	"damage",
	"fire_rate",
	"range",
	"stability",
	"agility",
	"stealth",
	"durability_burn",
	"magazine_size",
	"bullet_velocity",
	"reload_time",
	"recoil_horizontal",
	"recoil_vertical",
] as const;
export const statTypeEnum = pgEnum("stat_type", statTypeValues);
export type StatType = (typeof statTypeValues)[number];

// Modifier types
const modifierTypeValues = ["additive", "multiplicative"] as const;
export const modifierTypeEnum = pgEnum("modifier_type", modifierTypeValues);
export type ModifierType = (typeof modifierTypeValues)[number];
