import { useItems } from "@/contexts/itemContext";
import { Rarity, ItemCategory } from "@/types";
import { SortField, SortOrder } from "@/utils/items";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { memo, useMemo, useState, useEffect, useRef } from "react";

// Define arrays of available options
const rarityOptions: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
const categoryOptions: ItemCategory[] = [
	"recyclable",
	"valuable",
	"quick_use",
	"ammunition",
	"weapon",
	"gear",
	"misc",
	"topside_material",
];
const sortFieldOptions: { value: SortField; label: string }[] = [
	{ value: "name", label: "Name" },
	{ value: "rarity", label: "Rarity" },
	{ value: "category", label: "Category" },
	{ value: "none", label: "Default" },
];
const sortOrderOptions: { value: SortOrder; label: string }[] = [
	{ value: "asc", label: "Ascending" },
	{ value: "desc", label: "Descending" },
	{ value: "none", label: "Default" },
];

// Simple debounce function
const useDebounce = (callback: Function, delay: number) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return (...args: any[]) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

// Memoized filter item components
const RarityFilterItem = memo(
	({
		rarity,
		isChecked,
		onToggle,
		capitalize,
	}: {
		rarity: Rarity;
		isChecked: boolean;
		onToggle: (rarity: Rarity) => void;
		capitalize: (str: string) => string;
	}) => {
		// Local state for the checkbox
		const [localChecked, setLocalChecked] = useState(isChecked);

		// Update local state when context state changes
		useEffect(() => {
			setLocalChecked(isChecked);
		}, [isChecked]);

		// Debounce the context update
		const debouncedToggle = useDebounce((value: boolean) => {
			// Only update context if the local state is different
			if (value !== isChecked) {
				onToggle(rarity);
			}
		}, 300);

		// Handle checkbox change
		const handleChange = () => {
			const newValue = !localChecked;
			setLocalChecked(newValue);
			debouncedToggle(newValue);
		};

		return (
			<div className="flex items-center space-x-2">
				<Checkbox
					id={`rarity-${rarity}`}
					checked={localChecked}
					onCheckedChange={handleChange}
				/>
				<Label
					htmlFor={`rarity-${rarity}`}
					className="text-sm cursor-pointer flex items-center"
				>
					{capitalize(rarity)}
				</Label>
			</div>
		);
	}
);

const CategoryFilterItem = memo(
	({
		category,
		isChecked,
		onToggle,
		capitalize,
	}: {
		category: ItemCategory;
		isChecked: boolean;
		onToggle: (category: ItemCategory) => void;
		capitalize: (str: string) => string;
	}) => {
		// Local state for the checkbox
		const [localChecked, setLocalChecked] = useState(isChecked);

		// Update local state when context state changes
		useEffect(() => {
			setLocalChecked(isChecked);
		}, [isChecked]);

		// Debounce the context update
		const debouncedToggle = useDebounce((value: boolean) => {
			// Only update context if the local state is different
			if (value !== isChecked) {
				onToggle(category);
			}
		}, 300);

		// Handle checkbox change
		const handleChange = () => {
			const newValue = !localChecked;
			setLocalChecked(newValue);
			debouncedToggle(newValue);
		};

		return (
			<div className="flex items-center space-x-2">
				<Checkbox
					id={`category-${category}`}
					checked={localChecked}
					onCheckedChange={handleChange}
					className="cursor-pointer"
				/>
				<Label
					htmlFor={`category-${category}`}
					className="text-sm cursor-pointer flex items-center"
				>
					{capitalize(category)}
				</Label>
			</div>
		);
	}
);

export default function FilterSort() {
	const {
		filterState,
		sortState,
		toggleRarity,
		toggleCategory,
		setSort,
		resetFilters,
		setSearchQuery,
	} = useItems();

	// Helper function to capitalize first letter
	const capitalize = (str: string) =>
		str.charAt(0).toUpperCase() + str.replace("_", " ").slice(1);

	// Memoize the rarity filter section
	const RarityFilterSection = useMemo(
		() => (
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Rarity</h3>
				<div className="grid grid-cols-2 gap-2">
					{rarityOptions.map((rarity) => (
						<RarityFilterItem
							key={rarity}
							rarity={rarity}
							isChecked={filterState.rarities.includes(rarity)}
							onToggle={toggleRarity}
							capitalize={capitalize}
						/>
					))}
				</div>
			</div>
		),
		[filterState.rarities, toggleRarity]
	);

	// Memoize the category filter section
	const CategoryFilterSection = useMemo(
		() => (
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Category</h3>
				<div className="grid grid-cols-2 gap-2">
					{categoryOptions.map((category) => (
						<CategoryFilterItem
							key={category}
							category={category}
							isChecked={filterState.categories.includes(category)}
							onToggle={toggleCategory}
							capitalize={capitalize}
						/>
					))}
				</div>
			</div>
		),
		[filterState.categories, toggleCategory]
	);

	return (
		<div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
			{/* Sort Options */}
			{/* Sort Options Section - Memoized */}
			{useMemo(
				() => (
					<div className="space-y-3">
						<h3 className="font-medium text-sm">Sort Options</h3>

						<div className="space-y-2">
							<Label
								htmlFor="sort-field"
								className="text-sm"
							>
								Sort By
							</Label>
							<Select
								value={sortState.sortField}
								onValueChange={(value: SortField) =>
									setSort(value, sortState.sortOrder)
								}
							>
								<SelectTrigger
									id="sort-field"
									className="w-full"
								>
									<SelectValue placeholder="Select field" />
								</SelectTrigger>
								<SelectContent>
									{sortFieldOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="sort-order"
								className="text-sm"
							>
								Sort Order
							</Label>
							<Select
								value={sortState.sortOrder}
								onValueChange={(value: SortOrder) =>
									setSort(sortState.sortField, value)
								}
							>
								<SelectTrigger
									id="sort-order"
									className="w-full"
								>
									<SelectValue placeholder="Select order" />
								</SelectTrigger>
								<SelectContent>
									{sortOrderOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				),
				[sortState, setSort]
			)}

			<Separator />

			{/* Rarity Filter Section */}
			{RarityFilterSection}

			<Separator />

			{/* Category Filter Section */}
			{CategoryFilterSection}

			<Separator />

			{/* Additional Filters */}
			{/* Additional Filters Section - Memoized */}
			{useMemo(
				() => (
					<div className="space-y-3">
						<h3 className="font-medium text-sm">Additional Filters</h3>

						{/* Since we don't have direct access to setFilterState, we'll use a workaround */}
						{/* For now, we'll disable these filters until we can update the context */}
						<div className="flex items-center justify-between opacity-50">
							<Label
								htmlFor="filter-recyclable"
								className="text-sm"
							>
								Show Recyclable Only
							</Label>
							<Switch
								id="filter-recyclable"
								checked={filterState.showRecyclable || false}
								disabled={true}
							/>
						</div>

						<div className="flex items-center justify-between opacity-50">
							<Label
								htmlFor="filter-craftable"
								className="text-sm"
							>
								Show Craftable Only
							</Label>
							<Switch
								id="filter-craftable"
								checked={filterState.showCraftable || false}
								disabled={true}
							/>
						</div>

						<div className="flex items-center justify-between opacity-50">
							<Label
								htmlFor="filter-has-stats"
								className="text-sm"
							>
								Show Items with Stats Only
							</Label>
							<Switch
								id="filter-has-stats"
								checked={filterState.showHasStats || false}
								disabled={true}
							/>
						</div>
					</div>
				),
				[filterState.showRecyclable, filterState.showCraftable, filterState.showHasStats]
			)}
		</div>
	);
}
