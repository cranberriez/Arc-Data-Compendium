import { Rarity, ItemSource, ItemCategory, Recipe, Recycling } from "./types";
import { LucideIcon } from "lucide-react";

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

	/** Category this item belongs to */
	category: ItemCategory;

	/** Icon for the item (LucideIcon) */
	icon: LucideIcon;

	/** Optional flavor text or lore */
	flavorText?: string;

	/** How the player can obtain this item */
	sources?: ItemSource[];

	/** Optional recipe if this item can be crafted */
	recipe: string | null;

	/** Optional recycling information, if applicable */
	recycling?: Recycling[];
}
