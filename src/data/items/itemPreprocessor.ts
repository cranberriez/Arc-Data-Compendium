// src/data/items/itemPreprocessor.ts
import { Item } from "@/types";
import { getItemSources } from "./itemUtils";

// Type for single item processor
type ItemProcessor<T = Item> = (item: T, allItems?: T[]) => T;

// Type for processor composition
type ProcessorComposer = <T = Item>(...processors: ItemProcessor<T>[]) => ItemProcessor<T>;

/**
 * Creates a processor that applies multiple processors in sequence
 * Can handle both sync and async processors
 */
export const composeProcessors: ProcessorComposer =
	(...processors) =>
	(item, allItems) => {
		let result = { ...item };
		for (const processor of processors) {
			result = processor(result, allItems);
		}
		return result;
	};

/**
 * Applies processors to an array of items
 * Can process items in parallel or series
 */
export const processItems = <T = Item>(
	items: T[],
	processor: ItemProcessor<T>,
	options: { parallel?: boolean } = { parallel: true }
): T[] => {
	if (options.parallel) {
		return items.map((item) => processor(item, items));
	}

	const results: T[] = [];
	for (const item of items) {
		results.push(processor(item, items));
	}
	return results;
};

// Individual processors
export const addSources: ItemProcessor<Item> = (item, allItems = []) => ({
	...item,
	get sources() {
		return getItemSources(item.id, allItems);
	},
});

export const processIcons: ItemProcessor<Item> = (item) => {
	if (!item.icon) return item;

	return {
		...item,
		// Add icon processing logic here
		// Example: icon: normalizeIconName(item.icon)
	};
};

export const validateItem: ItemProcessor<Item> = (item) => {
	// Add validation logic here
	// Could throw errors or log warnings for invalid items
	return item;
};

// Example usage with composition
export const defaultItemProcessor = composeProcessors(
	// addSources, // Incompatible type with default processors
	processIcons,
	validateItem
	// Add more processors as needed
);

// Helper to process all items with the default processor
export const processAllItems = (items: Item[]) => processItems(items, defaultItemProcessor);
