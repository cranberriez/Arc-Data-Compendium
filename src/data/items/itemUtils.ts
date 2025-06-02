import { Item } from "@/types";
import { ItemSource } from "@/types/items/types";
import {
	Cog,
	Heart,
	Info,
	LucideIcon as LucideIconType,
	MapPin,
	Package,
	Shield,
	Sword,
	Trophy,
	Wrench,
	Zap,
} from "lucide-react";

// Cache for reverse lookup of recycle sources
let recycleSourceCache: Map<string, ItemSource[]> | null = null;

/**
 * Builds a reverse lookup map for recycling sources
 * @param items Array of all items
 * @returns Map where key is item ID and value is array of sources that can be recycled into it
 */
function buildRecycleSourceMap(items: Item[]): Map<string, ItemSource[]> {
	const sourceMap = new Map<string, ItemSource[]>();

	items.forEach((item) => {
		if (item.recycling) {
			item.recycling.forEach((recycle) => {
				if (!sourceMap.has(recycle.id)) {
					sourceMap.set(recycle.id, []);
				}

				sourceMap.get(recycle.id)?.push({
					type: "recycle",
					fromItemId: item.id,
					count: recycle.count,
				});
			});
		}
	});

	return sourceMap;
}

/**
 * Gets all sources for an item, including reverse lookup of recycling sources
 * @param itemId ID of the item to get sources for
 * @param items Array of all items
 * @returns Array of all sources for the item
 */
export function getItemSources(itemId: string, items: Item[]): ItemSource[] {
	// Find the item
	const item = items.find((i) => i.id === itemId);
	if (!item) return [];

	// Initialize the cache if needed
	if (!recycleSourceCache) {
		recycleSourceCache = buildRecycleSourceMap(items);
	}

	const sources: ItemSource[] = [];
	// Get the original sources (buy only, now)
	// if (item.sources) {
	// 	for (const src of item.sources) {
	// 		if (src.type === "buy") {
	// 			// Only push buy sources, matching the new structure
	// 			sources.push({
	// 				type: "buy",
	// 				trader: src.trader,
	// 				value: src.value,
	// 				count: src.count,
	// 			});
	// 		}
	// 	}
	// }

	// Add recycling sources if any
	const recycleSources = recycleSourceCache.get(itemId) || [];
	sources.push(...recycleSources);

	return sources;
}

/**
 * Gets items that can be recycled into the specified item
 * @param itemId ID of the item to check
 * @param items Array of all items
 * @returns Array of items that can be recycled into the specified item
 */
export function getRecycleSources(itemId: string, items: Item[]): ItemSource[] {
	if (!recycleSourceCache) {
		recycleSourceCache = buildRecycleSourceMap(items);
	}
	return recycleSourceCache.get(itemId) || [];
}

/**
 * Invalidates the recycle source cache
 * Call this after modifying items that affect recycling
 */
export function invalidateRecycleCache(): void {
	recycleSourceCache = null;
}

import { LucideIcon } from "lucide-react";
import { Rarity, ItemCategory } from "@/types/items/types";

const rarityClasses = {
	common: {
		border: "border-common",
		text: "text-common",
		bg: "bg-common",
	},
	uncommon: {
		border: "border-uncommon",
		text: "text-uncommon",
		bg: "bg-uncommon",
	},
	rare: {
		border: "border-rare",
		text: "text-rare",
		bg: "bg-rare",
	},
	epic: {
		border: "border-epic",
		text: "text-epic",
		bg: "bg-epic",
	},
	legendary: {
		border: "border-legendary",
		text: "text-legendary",
		bg: "bg-legendary",
	},
};

export const getRarityColor = (rarity: string, type: "border" | "text" | "bg"): string => {
	const normalizedRarity = rarity.toLowerCase() as Rarity;
	const validRarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
	const safeRarity = validRarities.includes(normalizedRarity) ? normalizedRarity : "common";
	return rarityClasses[safeRarity][type];
};

export const getTypeIcon = (category: string): LucideIconType => {
	switch (category.toLowerCase()) {
		case "quick_use":
			return Zap;
		case "weapon":
			return Sword;
		case "gear":
			return Shield;
		case "trinket":
			return Trophy;
		case "consumable":
			return Heart;
		case "recyclable":
			return Wrench;
		case "crafting_material":
			return Cog;
		case "misc":
			return Package;
		case "topside_material":
			return MapPin;
		default:
			return Info;
	}
};

export const formatName = (type: string) => {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const formatCamelName = (type: string) => {
	return type.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
};

export const formatValue = (value: number) => {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

export const searchFunc = (item: Item, query: string) => {
	// Helper: normalize and tokenize
	const normalize = (str: string) =>
		str
			.toLowerCase()
			.replace(/[_\s]+/g, " ") // treat underscores and spaces the same
			.replace(/[^a-z0-9 ]/g, "") // remove non-alphanum except space
			.trim();

	const queryNorm = normalize(query);
	if (!queryNorm) return false;

	const queryTokens = queryNorm.split(" ").filter(Boolean);

	// Prepare name and id tokens
	const nameTokens = normalize(item.name).split(" ").filter(Boolean);
	const idTokens = normalize(item.id).split(" ").filter(Boolean);

	// Also prepare compact versions (remove all spaces and underscores)
	const compact = (str: string) =>
		str
			.toLowerCase()
			.replace(/[_\s]+/g, "")
			.replace(/[^a-z0-9]/g, "");
	const compactQuery = compact(query);
	const compactName = compact(item.name);
	const compactId = compact(item.id);

	// Match if every query token is found in either name or id tokens,
	// or if the compact query is a substring of the compact name or id
	return (
		queryTokens.every(
			(qt) =>
				nameTokens.some((nt) => nt.includes(qt)) || idTokens.some((it) => it.includes(qt))
		) ||
		(compactQuery.length > 0 &&
			(compactName.includes(compactQuery) || compactId.includes(compactQuery)))
	);
};
