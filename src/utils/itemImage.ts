/**
 * Gets the path to an item's image if it exists
 * @param itemId - The ID of the item (should be in snake_case, e.g., "advanced_electrical_components")
 * @returns The path to the image if it exists, otherwise null
 */
export function getItemImagePath(itemId: string): string | null {
	if (!itemId) return null;

	// Remove any file extension if present
	const baseName = itemId.replace(/\.\w+$/, "");

	// Convert to snake_case if not already
	const snakeName = baseName
		.toLowerCase()
		.replace(/[^a-z0-9\s_]/g, "") // Remove special chars except underscores
		.replace(/\s+/g, "_") // Replace spaces with underscores
		.replace(/_+/g, "_"); // Replace multiple underscores with single

	try {
		// Import the image - this will be handled by webpack's file-loader
		const image = require(`@/images/items/${snakeName}.png`);
		return image.default || image;
	} catch (error) {
		return null;
	}
}
