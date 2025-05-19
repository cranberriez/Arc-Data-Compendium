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
