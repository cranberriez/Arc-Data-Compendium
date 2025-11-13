"use client";

import { useState } from "react";
import { Item, Recipe } from "@/types";
import { RecycleSourceItem } from "./diagSourceItem";
import { Link, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";

type SourcesSectionProps = {
	item: Item;
	recyclingSources: Recipe[];
};

export function SourcesSection({ item, recyclingSources }: SourcesSectionProps) {
	const [showAllSources, setShowAllSources] = useState(false);

	if (!recyclingSources || recyclingSources.length === 0) return null;

	// Check if we need to show the "Show more/less" button
	const shouldShowToggle = recyclingSources.length > 4;
	const displaySources = showAllSources ? recyclingSources : recyclingSources.slice(0, 4);

	// Create two separate arrays for left and right columns
	const halfLength = Math.ceil(displaySources.length / 2);
	const leftColumnSources = displaySources.slice(0, halfLength);
	const rightColumnSources = displaySources.slice(halfLength);

	console.log(recyclingSources);

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
				<div className="flex flex-col md:flex-row gap-2 md:gap-0 w-fit">
					{/* Left Column */}
					<div className="flex flex-col gap-2 md:pr-4">
						{leftColumnSources.map((sourceRecipe) => {
							return getRecycleSourceItem(item, sourceRecipe);
						})}
					</div>

					{/* Divider */}
					{leftColumnSources.length > 0 && rightColumnSources.length > 0 && (
						<div className="hidden md:block w-px bg-secondary-foreground/20 dark:bg-secondary-foreground/10 mx-2"></div>
					)}

					{/* Right Column */}
					<div className="flex flex-col gap-2 md:pl-4">
						{rightColumnSources.map((sourceRecipe) => {
							return getRecycleSourceItem(item, sourceRecipe);
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
								Show {recyclingSources.length - 4} more
							</>
						)}
					</Button>
				)}
			</ScrollArea>
		</div>
	);
}

const getRecycleSourceItem = (item: Item, sourceRecipe: Recipe) => {
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
		/>
	);
};
