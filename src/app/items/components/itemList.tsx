"use client";

import { Item } from "@/types";
import ItemCard from "@/components/items/ItemCard";
import { applyItemFilters, sortItems } from "@/utils/items";
import { useItems } from "@/contexts/itemContext";
import { Fragment, useMemo } from "react";

interface ItemListProps {
	initialItems: Item[];
}

export function ItemList({ initialItems }: ItemListProps) {
	const { filterState, sortState } = useItems();
	const sortedItems = sortItems(initialItems, sortState);
	const filteredItems = applyItemFilters(sortedItems, filterState);

	// Calculate value percentiles when sorting by value
	const valuePercentiles = useMemo(() => {
		if (sortState.sortField !== "value") return null;

		// Get all non-zero values and sort them
		const values = initialItems
			.map((item) => item.value)
			.filter((v) => v > 0)
			.sort((a, b) => a - b);

		if (values.length === 0) return null;

		// Calculate percentile breaks (0%, 25%, 50%, 75%, 100%)
		const breaks = [0, 0.25, 0.5, 0.75, 1].map((p) => {
			const pos = (values.length - 1) * p;
			const base = Math.floor(pos);
			const rest = pos - base;
			if (values[base + 1] !== undefined) {
				return values[base] + rest * (values[base + 1] - values[base]);
			}
			return values[base];
		});

		return breaks;
	}, [initialItems, sortState.sortField]);

	// Get percentile for a value
	const getPercentile = (value: number): string => {
		if (!valuePercentiles || value <= 0) return "No Value";

		if (value >= valuePercentiles[4]) return "Premium (Top 25%)";
		if (value >= valuePercentiles[3]) return "High Value (Top 26-50%)";
		if (value >= valuePercentiles[2]) return "Above Average (51-75%)";
		if (value >= valuePercentiles[1]) return "Below Average (76-100%)";
		return "Budget (Lowest 25%)";
	};

	// Don't show headers for these sort fields
	const noHeaders = ["none", "name"]; // Removed 'value' from noHeaders
	const showHeaders = !noHeaders.includes(sortState.sortField);

	let lastHeader: string | null = null;

	return (
		<>
			{filteredItems.map((item) => {
				let currentValue: string | undefined;
				let capitalized: string = "";
				let shouldShowHeader = false;

				if (showHeaders) {
					if (sortState.sortField === "value") {
						currentValue = getPercentile(item.value);
					} else {
						currentValue = item[sortState.sortField as keyof Item] as
							| string
							| undefined;
						if (currentValue) {
							currentValue = currentValue
								.split("_")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ");
						}
					}
					shouldShowHeader = currentValue !== lastHeader;
					lastHeader = currentValue || "";
					capitalized = currentValue || "";
				}

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
						<ItemCard item={item} variant="default" size="xl" />
					</Fragment>
				);
			})}
		</>
	);
}
