"use client";

import { useState, useEffect, useMemo } from "react";
import { useItems } from "@/contexts/itemContext";
import { getTypeIcon, getRarityColor, formatName, searchFunc } from "@/data/items/itemUtils";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { ItemCategory } from "@/types/items/types";
import React from "react";
import { useDialog } from "@/contexts/dialogContext";

export function SearchDialog({
	open,
	onOpenChange,
	allItems,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	allItems: Item[];
}) {
	const { setSearchQuery, setCategory } = useItems();
	// Local search state that doesn't affect global filtering until selection
	const [localSearch, setLocalSearch] = useState("");
	// Local category state that doesn't affect global filtering until selection
	const [localCategory, setLocalCategory] = useState<ItemCategory | null>(null);

	const { openDialog } = useDialog();

	// Reset local search when dialog closes
	useEffect(() => {
		if (!open) {
			setLocalSearch("");
		}
	}, [open]);

	// Filter items based on local search
	const queriedItems = useMemo(() => {
		const query = localSearch.toLowerCase().replace(" ", "").replace("_", "").trim();

		// Always show all items when search is empty
		if (!query) return allItems;

		// Filter items by search query
		return allItems.filter((item) => searchFunc(item, query));
	}, [allItems, localSearch]);

	// Get unique categories from all items, not just filtered items
	const categories = useMemo(() => {
		const uniqueCategories = new Set<ItemCategory>();
		// Use allItems instead of queriedItems to always show all categories
		allItems.forEach((item) => uniqueCategories.add(item.category as ItemCategory));
		return Array.from(uniqueCategories);
	}, [allItems]);

	// Count items by category based on filtered items
	const categoryCounts = useMemo((): Record<ItemCategory, number> => {
		// Initialize with all categories at 0 count
		const initialCounts = categories.reduce((acc, category) => {
			acc[category] = 0;
			return acc;
		}, {} as Record<ItemCategory, number>);

		// Increment counts based on filtered items
		const counts = queriedItems.reduce((acc, item) => {
			acc[item.category as ItemCategory]++;
			return acc;
		}, initialCounts);
		console.log(counts);

		if (queriedItems.length > 0 && queriedItems.length < 10) {
			console.log(queriedItems);
		}

		return counts;
	}, [categories, queriedItems]);

	// Determine which categories to display based on counts
	const displayedCategories = useMemo(() => {
		// If no search query, show all categories
		if (!localSearch) return categories;

		// Otherwise, show categories with items matching the search
		return categories.filter((category) => categoryCounts[category] > 0);
	}, [categories, categoryCounts, localSearch]);

	// Handle category selection
	const handleCategorySelect = (category: ItemCategory) => {
		// Apply both search term and category filter
		setSearchQuery(localSearch);
		setCategory(category);
		onOpenChange(false);
	};

	// Handle item selection
	const handleItemSelect = (item: Item) => {
		// Close the dialog
		onOpenChange(false);

		// TODO: open item dialog or search for specific item
		openDialog("item", item);
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<CommandInput
				placeholder="Search for items..."
				value={localSearch}
				onValueChange={setLocalSearch}
				className="sm:border-b rounded-none"
				autoFocus
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				{/* Always show category filter group */}
				<CommandGroup heading="Filter by Category">
					{displayedCategories.map((category) => (
						<CommandItem
							key={`category-${category}`}
							onSelect={() => handleCategorySelect(category)}
							value={`${localSearch} ${category}`}
						>
							<div className="flex items-center gap-2">
								{/* Category icon */}
								<div className="h-5 w-5">
									{React.createElement(getTypeIcon(category), {
										size: 16,
									})}
								</div>

								{/* Category name */}
								<span>{formatName(category)}</span>

								{/* Count badge */}
								<Badge
									variant="secondary"
									className="ml-auto"
								>
									{categoryCounts[category]}
								</Badge>
							</div>
						</CommandItem>
					))}
				</CommandGroup>

				{/* Show individual items */}
				{queriedItems.length > 0 && queriedItems.length <= 10 && (
					<>
						{displayedCategories.length > 0 && <CommandSeparator />}
						<CommandGroup heading="Items">
							{queriedItems.map((item) => (
								<CommandItem
									key={`item-${item.id}`}
									onSelect={() => handleItemSelect(item)}
									value={`item-${item.name}`}
								>
									<div className="flex items-center gap-2">
										{/* Item icon */}
										<div className="h-5 w-5">
											{item.icon ? (
												<item.icon className="h-4 w-4" />
											) : (
												React.createElement(getTypeIcon(item.category), {
													className: "h-4 w-4",
												})
											)}
										</div>

										{/* Item name */}
										<span className="align-top">{item.name}</span>

										{/* Rarity dot */}
										<div
											className={`ml-auto h-2 w-2 rounded-full ${getRarityColor(
												item.rarity,
												"bg"
											)}`}
											title={`${
												item.rarity.charAt(0).toUpperCase() +
												item.rarity.slice(1)
											}`}
										/>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}
