"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useItems } from "@/contexts/itemContext";
import { getTypeIcon, getRarityColor, formatName, searchFunc } from "@/data/items/itemUtils";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { ItemCategory } from "@/types/items/types";
import { useDialog } from "@/contexts/dialogContext";
import { usePathname, useRouter } from "next/navigation";

export function SearchDialog({
	open,
	onOpenChange,
	allItems,
	showCategories,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	allItems: Item[];
	showCategories?: boolean;
}) {
	const { setSearchQuery, setCategory } = useItems();
	// Local search state that doesn't affect global filtering until selection
	const [localSearch, setLocalSearch] = useState("");
	// Local category state that doesn't affect global filtering until selection
	const [localCategory, setLocalCategory] = useState<ItemCategory | null>(null);

	const { openDialog } = useDialog();

	// TODO: Convert to a Utility
	const pathname = usePathname();
	const path = pathname.split("/");
	const currentPage = path[path.length - 1];
	const router = useRouter();

	const onItemsPage = currentPage === "items";
	// TODO: Convert to a Utility

	// Reset local search when dialog closes
	useEffect(() => {
		if (!open) {
			setLocalSearch("");
		}
	}, [open]);

	// Filter items based on local search
	const queriedItems = useMemo(() => {
		const query = localSearch;

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
		if (queriedItems.length < 25) {
			console.log(queriedItems);
		}

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
		// Switch to items page where category is useful
		// TODO: Convert to a Utility and use it here
		if (!onItemsPage) {
			router.push("/items");
		}

		// Apply both search term and category filter
		setSearchQuery(localSearch);
		setCategory(category);
		onOpenChange(false);
	};

	// Handle item selection
	const handleItemSelect = (item: Item) => {
		// Close the dialog
		onOpenChange(false);

		// Open item dialog for this item
		openDialog("item", item);
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
			className="top-[3rem] translate-y-0"
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

				<CommandGroup heading="Filter by Category">
					{displayedCategories.map((category) => (
						<CommandItem
							key={`category-${category}`}
							onSelect={() => handleCategorySelect(category)}
							value={`${localSearch} ${category}`}
						>
							<div className="flex items-center gap-2">
								{/* Category icon */}
								<div className="h-5 w-5 flex items-center justify-center">
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

				{queriedItems.length > 0 && queriedItems.length <= 25 && (
					<>
						{displayedCategories.length > 0 && <CommandSeparator />}
						<CommandGroup heading="Items">
							{createCommandItems(queriedItems, handleItemSelect, localSearch)}
						</CommandGroup>
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}

const createCommandItems = (
	queriedItems: Item[],
	handleItemSelect: (item: Item) => void,
	localSearch: string
) => {
	console.log(queriedItems);

	return queriedItems.map((item) => (
		<CommandItem
			key={`item-${item.id}`}
			onSelect={() => handleItemSelect(item)}
			value={`${localSearch} ${item.name}`}
		>
			<div className="flex items-center gap-2">
				{/* Item icon */}
				<div className="h-5 w-5 flex items-center justify-center">
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
					className={`ml-auto h-2 w-2 rounded-full ${getRarityColor(item.rarity, "bg")}`}
					title={`${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}`}
				/>
			</div>
		</CommandItem>
	));
};
