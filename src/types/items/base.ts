// Remove LucideIcon import - we'll use string for icon names

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

	/** Icon name as string (will be converted to LucideIcon on client) */
	icon: string;

	/** ISO string of creation date (set by API) */
	created?: string;

	/** ISO string of last update date (set by API) */
	updated?: string;
}
