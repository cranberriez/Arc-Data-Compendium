"use client";

import { useState } from "react";
import { Item, Recipe } from "@/types";
import { RecycleSourceItem } from "./diagSourceItem";
import { Link, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";

type QuantityRange = {
	minQty: number;
	maxQty: number;
};

export type RecipeQuantity = {
	inputs: Record<string, QuantityRange>;
	outputs: Record<string, QuantityRange>;
};

type RecipeQuantityMap = Record<string, RecipeQuantity>;

type SourcesSectionProps = {
	item: Item;
	recyclingSources: Recipe[];
};

export function SourcesSection({ item, recyclingSources }: SourcesSectionProps) {
	const [showAllSources, setShowAllSources] = useState(false);
	const aggregatedRecipes = collectDuplicateRecipes(recyclingSources);
	const uniqueRecyclingSources = aggregatedRecipes.recipes;
	const quantityRanges = aggregatedRecipes.quantityRanges;

	if (!uniqueRecyclingSources || uniqueRecyclingSources.length === 0) return null;

	// Check if we need to show the "Show more/less" button
	const shouldShowToggle = uniqueRecyclingSources.length > 4;
	const displaySources = showAllSources
		? uniqueRecyclingSources
		: uniqueRecyclingSources.slice(0, 4);

	// Create two separate arrays for left and right columns
	const halfLength = Math.ceil(displaySources.length / 2);
	const leftColumnSources = displaySources.slice(0, halfLength);
	const rightColumnSources = displaySources.slice(halfLength);

	return (
		<div className="w-full m-w-fit">
			<div className="font-mono font-light w-fit flex items-center gap-2 mb-2">
				<Link className="inline-block" size={24} />
				<p>
					<span className="inline-block text-lg">Recycling Sources:</span>
					<span className="text-xs text-muted-foreground">
						{" "}
						({recyclingSources?.length})
					</span>
				</p>
			</div>

			<ScrollArea className="w-fit min-w-full max-h[minmax(200px, 60vh)]">
				<div className="flex flex-1 flex-col md:flex-row gap-2 md:gap-0 min-w-fit w-full justify-between">
					{/* Left Column */}
					<div className="flex flex-col gap-2 md:pr-4">
						{leftColumnSources.map((sourceRecipe) => {
							return getRecycleSourceItem(
								item,
								sourceRecipe,
								quantityRanges[sourceRecipe.id]
							);
						})}
					</div>

					{/* Divider */}
					{leftColumnSources.length > 0 && rightColumnSources.length > 0 && (
						<div className="hidden md:block w-px bg-secondary-foreground/20 dark:bg-secondary-foreground/10 mx-2"></div>
					)}

					{/* Right Column */}
					<div className="flex flex-col gap-2 md:pl-4">
						{rightColumnSources.map((sourceRecipe) => {
							return getRecycleSourceItem(
								item,
								sourceRecipe,
								quantityRanges[sourceRecipe.id]
							);
						})}
					</div>
				</div>
				{shouldShowToggle && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 w-full justify-center text-xs text-muted-foreground cursor-pointer"
						onClick={() => setShowAllSources(!showAllSources)}
					>
						{showAllSources ? (
							<>
								<ChevronUp className="mr-1 h-3 w-3" />
								Show less
							</>
						) : (
							<>
								<ChevronDown className="mr-1 h-3 w-3" />
								Show {uniqueRecyclingSources.length - 4} more
							</>
						)}
					</Button>
				)}
			</ScrollArea>
		</div>
	);
}

const getRecycleSourceItem = (item: Item, sourceRecipe: Recipe, quantityRange: RecipeQuantity) => {
	if (!sourceRecipe.io) return null;

	const mainItem = sourceRecipe.io.filter((io) => io.role === "output" && io.itemId === item.id);

	if (!mainItem) return null;

	const mainItemQty = mainItem[0].qty;

	const sourceItem = sourceRecipe.io.filter((io) => io.role === "input")[0];

	if (!sourceItem) return null;
	return (
		<RecycleSourceItem
			key={sourceItem.itemId}
			mainItem={item}
			mainItemQty={mainItemQty}
			sourceRecipe={sourceRecipe}
			quantityRange={quantityRange}
		/>
	);
};

const collectDuplicateRecipes = (
	recipes: Recipe[]
): { recipes: Recipe[]; quantityRanges: RecipeQuantityMap } => {
	if (!recipes || recipes.length === 0) {
		return { recipes: [], quantityRanges: {} };
	}

	const groupedRecipes = new Map<string, Recipe[]>();

	for (const recipe of recipes) {
		const ioEntries = recipe.io ?? [];
		const inputIds = ioEntries
			.filter((entry) => entry.role === "input")
			.map((entry) => entry.itemId)
			.sort()
			.join("|");
		const outputIds = ioEntries
			.filter((entry) => entry.role === "output")
			.map((entry) => entry.itemId)
			.sort()
			.join("|");
		const groupKey = inputIds ? `${inputIds}->${outputIds}` : recipe.id;
		const group = groupedRecipes.get(groupKey);
		if (group) {
			group.push(recipe);
		} else {
			groupedRecipes.set(groupKey, [recipe]);
		}
	}

	const dedupedRecipes: Recipe[] = [];
	const quantityRanges: RecipeQuantityMap = {};

	const computeRangeForGroup = (
		group: Recipe[],
		role: "input" | "output",
		itemId: string
	): QuantityRange | null => {
		const quantities: number[] = [];

		group.forEach((groupRecipe) => {
			(groupRecipe.io ?? []).forEach((ioEntry) => {
				if (ioEntry.role === role && ioEntry.itemId === itemId) {
					quantities.push(ioEntry.qty ?? 0);
				}
			});
		});

		if (quantities.length === 0) {
			return null;
		}

		const minQty = Math.min(...quantities);
		const maxQty = Math.max(...quantities);

		return { minQty, maxQty };
	};

	groupedRecipes.forEach((group) => {
		if (group.length === 0) return;
		const representative = group[0];

		dedupedRecipes.push(representative);

		const ioEntries = representative.io ?? [];
		const uniqueInputIds = Array.from(
			new Set(
				ioEntries.filter((entry) => entry.role === "input").map((entry) => entry.itemId)
			)
		);
		const uniqueOutputIds = Array.from(
			new Set(
				ioEntries.filter((entry) => entry.role === "output").map((entry) => entry.itemId)
			)
		);

		const inputsRange: Record<string, QuantityRange> = {};
		uniqueInputIds.forEach((itemId) => {
			const range = computeRangeForGroup(group, "input", itemId);
			if (range) {
				inputsRange[itemId] = range;
			}
		});

		const outputsRange: Record<string, QuantityRange> = {};
		uniqueOutputIds.forEach((itemId) => {
			const range = computeRangeForGroup(group, "output", itemId);
			if (range) {
				outputsRange[itemId] = range;
			}
		});

		quantityRanges[representative.id] = {
			inputs: inputsRange,
			outputs: outputsRange,
		};
	});

	return { recipes: dedupedRecipes, quantityRanges };
};
