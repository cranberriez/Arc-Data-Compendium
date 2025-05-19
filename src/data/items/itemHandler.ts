import { BaseItem } from "@/types/items/base";
import { getItemSources, getRecycleSources, invalidateRecycleCache } from "./itemUtils";
import { itemsData } from "./itemData";

// Process items to include dynamic sources
const processedItems = itemsData.map((item: BaseItem) => ({
	...item,
	// This will be called when the item is accessed
	get sources() {
		return getItemSources(item.id, itemsData);
	},
}));

// Export the processed items with dynamic sources
export const items: BaseItem[] = processedItems;

// Export utility functions
export { getItemSources, getRecycleSources, invalidateRecycleCache };
