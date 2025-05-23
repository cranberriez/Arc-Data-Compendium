/**
 * Gets the path to an item's image if it exists
 * @param itemId - The ID of the item (should be in snake_case, e.g., "advanced_electrical_components")
 * @returns The path to the image if it exists, otherwise null
 */
export function getItemImagePath(itemId: string): string | null {
	if (!itemId) return null;

	return `/images/items/${itemId}.png`;
}
