import { useItems } from "@/contexts/itemContext";
import { Rarity, ItemCategory } from "@/types";
import { SortField, SortOrder } from "@/utils/items";
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
import { memo } from "react";

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

// Generic checkbox filter item component
const CheckboxFilterItem = memo(
	({
		id,
		label,
		isChecked,
		onToggle,
		className = "",
	}: {
		id: string;
		label: string;
		isChecked: boolean;
		onToggle: () => void;
		className?: string;
	}) => (
		<div className="flex items-center space-x-2">
			<Checkbox
				id={id}
				checked={isChecked}
				onCheckedChange={onToggle}
				className={`cursor-pointer ${className}`}
			/>
			<Label
				htmlFor={id}
				className="text-sm cursor-pointer flex items-center"
			>
				{label}
			</Label>
		</div>
	)
);

// Toggle switch component for additional filters
const ToggleFilterItem = memo(
	({
		id,
		label,
		isChecked,
		onToggle,
	}: {
		id: string;
		label: string;
		isChecked: boolean;
		onToggle: () => void;
	}) => (
		<div className="flex items-center justify-between">
			<Label
				htmlFor={id}
				className="text-sm cursor-pointer"
			>
				{label}
			</Label>
			<Switch
				id={id}
				checked={isChecked}
				onCheckedChange={onToggle}
			/>
		</div>
	)
);

export default function FilterSort() {
	const {
		filterState,
		sortState,
		toggleRarity,
		toggleCategory,
		toggleRecyclable,
		toggleCraftable,
		toggleHasStats,
		setSort,
	} = useItems();

	// Helper function to capitalize first letter
	const capitalize = (str: string) =>
		str.charAt(0).toUpperCase() + str.replace("_", " ").slice(1);

	return (
		<div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
			{/* Sort Options */}
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
						onValueChange={(value: SortField) => setSort(value, sortState.sortOrder)}
					>
						<SelectTrigger
							id="sort-field"
							className="w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<SelectValue placeholder="Select field" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							sideOffset={5}
							onCloseAutoFocus={(e) => e.preventDefault()}
						>
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
						onValueChange={(value: SortOrder) => setSort(sortState.sortField, value)}
					>
						<SelectTrigger
							id="sort-order"
							className="w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<SelectValue placeholder="Select order" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							sideOffset={5}
							onCloseAutoFocus={(e) => e.preventDefault()}
						>
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

			<Separator />

			{/* Rarity Filter Section */}
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Rarity</h3>
				<div className="grid grid-cols-2 gap-2">
					{rarityOptions.map((rarity) => (
						<CheckboxFilterItem
							key={rarity}
							id={`rarity-${rarity}`}
							label={capitalize(rarity)}
							isChecked={filterState.rarities.includes(rarity)}
							onToggle={() => toggleRarity(rarity)}
						/>
					))}
				</div>
			</div>

			<Separator />

			{/* Category Filter Section */}
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Category</h3>
				<div className="grid grid-cols-2 gap-2">
					{categoryOptions.map((category) => (
						<CheckboxFilterItem
							key={category}
							id={`category-${category}`}
							label={capitalize(category)}
							isChecked={filterState.categories.includes(category)}
							onToggle={() => toggleCategory(category)}
						/>
					))}
				</div>
			</div>

			<Separator />

			{/* Additional Filters */}
			<div className="space-y-3">
				<h3 className="font-medium text-sm">Additional Filters</h3>
				<div className="space-y-3">
					<ToggleFilterItem
						id="filter-recyclable"
						label="Show Recyclable Only"
						isChecked={filterState.showRecyclable || false}
						onToggle={toggleRecyclable}
					/>

					<ToggleFilterItem
						id="filter-craftable"
						label="Show Craftable Only"
						isChecked={filterState.showCraftable || false}
						onToggle={toggleCraftable}
					/>

					<ToggleFilterItem
						id="filter-has-stats"
						label="Show Items with Stats Only"
						isChecked={filterState.showHasStats || false}
						onToggle={toggleHasStats}
					/>
				</div>
			</div>
		</div>
	);
}
