import { BaseItem } from "./base";
import { QuickUseData } from "./quickuse";
import { ItemCategory, ItemSource, Rarity, Recycling } from "./types";

/**
 * Base interface that all items must implement
 */
export interface Item extends BaseItem {
	/** Unique identifier for the item */
	//id: string;

	/** Display name of the item */
	//name: string;

	/** Item description (can include flavor text) */
	//description: string;

	/** Icon for the item (LucideIcon) */
	//icon: LucideIcon;

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

	/** Optional flavor text or lore */
	flavorText?: string;

	/** How the player can obtain this item */
	sources?: ItemSource[];

	/** Optional recipe if this item can be crafted */
	recipeId: string | null;

	/** Optional recycling information, if applicable */
	recycling?: Recycling[];

	/** Quick use item data encapsulator */
	quickUse?: QuickUseData;
}
