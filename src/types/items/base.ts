import { Rarity, ItemSource, ItemCategory, Recipe } from "./types";

/**
 * Base interface that all items must implement
 */
export interface BaseItem {
	/** Unique identifier for the item */
	id: string;

	/** Display name of the item */
	name: string;

	/** Item description (can include flavor text) */
	description: string;

	/** Rarity of the item */
	rarity: Rarity;

	/** Base value in currency */
	value: number;

	/** Weight in inventory (in kg) */
	weight: number;

	/** Maximum stack size (1 for non-stackable items) */
	maxStack: number;

	/** Categories this item belongs to */
	categories: ItemCategory[];

	/** Path to the item's icon */
	icon: string;

	/** Optional flavor text or lore */
	flavorText?: string;

	/** How the player can obtain this item */
	sources?: ItemSource[];

	/** Optional recipe if this item can be crafted */
	recipe?: Recipe;

	/** Version of the item data structure */
	version: number;
}

/**
 * Extended item interface with additional metadata
 */
export interface ExtendedItem extends BaseItem {
	/** When this item was first added to the game */
	addedInVersion: string;

	/** Last time this item was modified */
	lastUpdated: string;

	/** Whether this item is considered a base game item */
	isBaseGame: boolean;

	/** Whether this item is available in the current game version */
	isActive: boolean;
}

/**
 * Represents an item instance in the player's inventory
 */
export interface InventoryItem extends BaseItem {
	/** Unique instance ID (for stackable items) */
	instanceId: string;

	/** Current stack size */
	quantity: number;

	/** Current durability (0-1) */
	durability?: number;

	/** When this item was acquired */
	acquiredAt: Date;

	/** Optional custom name */
	customName?: string;

	/** Optional array of modifiers or enhancements */
	modifiers?: ItemModifier[];
}

/**
 * Represents a modifier that can be applied to an item
 */
export interface ItemModifier {
	/** Unique identifier for this modifier */
	id: string;

	/** Display name of the modifier */
	name: string;

	/** Description of what the modifier does */
	description: string;

	/** Stats affected by this modifier */
	statModifiers: {
		[stat: string]: number | string | boolean;
	};

	/** Rarity of the modifier */
	rarity: Rarity;

	/** Whether this is a positive or negative modifier */
	isPositive: boolean;
}

/**
 * Represents an item that can be equipped
 */
export interface EquippableItem extends BaseItem {
	/** Slot this item can be equipped in */
	slot: string;

	/** Required level to equip */
	requiredLevel: number;

	/** Required attributes to equip */
	requiredAttributes?: {
		[attribute: string]: number;
	};

	/** Durability information */
	durability?: {
		current: number;
		max: number;
		degradeRate?: number; // Per use/hour
	};
}

/**
 * Represents an item that can be consumed
 */
export interface ConsumableItem extends BaseItem {
	/** Effects applied when consumed */
	effects: {
		type: string;
		value: number;
		duration?: number; // in seconds
	}[];

	/** Cooldown before it can be used again (in seconds) */
	cooldown: number;

	/** Whether the item is consumed on use */
	consumeOnUse: boolean;
}

/**
 * Union type of all possible item types
 */
export type Item = BaseItem | ExtendedItem | InventoryItem | EquippableItem | ConsumableItem;

/**
 * Type guard to check if an item is equippable
 */
export function isEquippable(item: Item): item is EquippableItem {
	return "slot" in item && "requiredLevel" in item;
}

/**
 * Type guard to check if an item is consumable
 */
export function isConsumable(item: Item): item is ConsumableItem {
	return "effects" in item && "cooldown" in item;
}

/**
 * Type guard to check if an item is an inventory item
 */
export function isInventoryItem(item: Item): item is InventoryItem {
	return "instanceId" in item && "quantity" in item && "acquiredAt" in item;
}
