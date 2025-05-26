"use client";

import { Item } from "@/types";
import { ItemCard } from "./itemDisplay";
import { applyItemFilters, sortItems } from "@/utils/items";
import { useItems } from "@/contexts/itemContext";

interface ItemListProps {
	initialItems: Item[];
}

export function ItemList({ initialItems }: ItemListProps) {
	const { filterState } = useItems();
	const items = sortItems(initialItems, "rarity", "asc");
	const filteredItems = applyItemFilters(items, {
		searchQuery: "",
		rarities: filterState.rarities,
		categories: filterState.categories,
	});

	return filteredItems.map((item) => (
		<ItemCard
			key={item.id}
			item={item}
		/>
	));
}
