"use client";

import { Item } from "@/types";
import { ItemCard } from "./itemDisplay";
import { applyItemFilters, sortItems } from "@/utils/items";
import { useItems } from "@/contexts/itemContext";
import { Fragment } from "react";

interface ItemListProps {
	initialItems: Item[];
}

export function ItemList({ initialItems }: ItemListProps) {
	const { filterState, sortState } = useItems();
	const items = sortItems(initialItems, sortState);
	const filteredItems = applyItemFilters(items, filterState);

	// Don't show headers for these sort fields
	const noHeaders = ["none", "name"];
	const showHeaders = !noHeaders.includes(sortState.sortField);

	let lastValue: string | null = null;

	return (
		<>
			{filteredItems.map((item) => {
				const currentValue = item[sortState.sortField as keyof Item] as string | undefined;
				const capitalized = currentValue
					? currentValue
							.split("_")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")
					: "";
				const shouldShowHeader = showHeaders && currentValue !== lastValue;
				lastValue = currentValue || "";

				return (
					<Fragment key={item.id}>
						{shouldShowHeader && (
							<div
								key={`header-${currentValue}`}
								className="col-span-full w-full py-2 px-4 bg-muted/50 text-muted-foreground font-medium rounded-md"
							>
								{capitalized || "Unknown"}
							</div>
						)}
						<ItemCard item={item} />
					</Fragment>
				);
			})}
		</>
	);
}
