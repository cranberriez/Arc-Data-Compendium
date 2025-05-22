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

	/** Icon for the item (LucideIcon) */
	icon: LucideIcon;
}
