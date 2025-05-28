import { useItems } from "@/contexts/itemContext";
import { Rarity, ItemCategory } from "@/types";
import { SortField, SortOrder } from "@/utils/items";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define arrays of available options
const rarityOptions: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
const categoryOptions: ItemCategory[] = [
	"recyclable",
	"valuable",
	"quick_use",
	"ammo",
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
CheckboxFilterItem.displayName = "CheckboxFilterItem";

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
ToggleFilterItem.displayName = "ToggleFilterItem";

export default function FilterSort() {
	const {
		filterState,
		sortState,
		setRarity,
		setCategory,
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
		<div className="mb-4 space-y-6">
			{/* Sort Options */}
			<div className="space-y-3">
				<div className="space-y-2">
					<Label
						htmlFor="sort-field"
						className="text-sm"
					>
						Sort By
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								id="sort-field"
								variant="outline"
								className="w-full justify-between"
							>
								{sortFieldOptions.find(
									(option) => option.value === sortState.sortField
								)?.label || "Select field"}
								<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-[var(--radix-popover-trigger-width)] p-0"
							align="start"
						>
							<div className="flex flex-col">
								{sortFieldOptions.map((option) => (
									<Button
										key={option.value}
										variant={
											sortState.sortField === option.value
												? "secondary"
												: "ghost"
										}
										className="justify-start"
										onClick={() => setSort(option.value, sortState.sortOrder)}
									>
										{option.label}
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<div className="space-y-2">
					<Label
						htmlFor="sort-order"
						className="text-sm"
					>
						Sort Order
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								id="sort-order"
								variant="outline"
								className="w-full justify-between"
							>
								{sortOrderOptions.find(
									(option) => option.value === sortState.sortOrder
								)?.label || "Select order"}
								<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-[var(--radix-popover-trigger-width)] p-0"
							align="start"
						>
							<div className="flex flex-col">
								{sortOrderOptions.map((option) => (
									<Button
										key={option.value}
										variant={
											sortState.sortOrder === option.value
												? "secondary"
												: "ghost"
										}
										className="justify-start"
										onClick={() => setSort(sortState.sortField, option.value)}
									>
										{option.label}
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<Separator />

			{/* Rarity Filter Section */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-medium text-sm">Rarity</h3>
					<Button
						variant="link"
						size="sm"
						aria-label="Clear filters"
						onClick={() => setRarity([])}
						className={cn(
							"relative cursor-pointer",
							filterState.rarities.length > 0 ? "text-red-400" : ""
						)}
						disabled={filterState.rarities.length === 0}
					>
						Reset
					</Button>
				</div>
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
				<div className="flex items-center justify-between">
					<h3 className="font-medium text-sm">Category</h3>
					<Button
						variant="link"
						size="sm"
						aria-label="Clear filters"
						onClick={() => setCategory([])}
						className={cn(
							"relative cursor-pointer",
							filterState.categories.length > 0 ? "text-red-400" : ""
						)}
						disabled={filterState.categories.length === 0}
					>
						Reset
					</Button>
				</div>
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
