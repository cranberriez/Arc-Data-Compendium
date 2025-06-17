"use client";

import { useState } from "react";
import { Item } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { SourceItem } from "./diagSourceItem";
import { Link, ChevronDown, ChevronUp, MoveRight, BadgeCent } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";

type SourcesSectionProps = {
	item: Item;
};

const formatNumber = (value: number) => {
	return value.toLocaleString("en-US", {
		useGrouping: true,
	});
};

export function SourcesSection({ item }: SourcesSectionProps) {
	const { getItemById } = useItems();
	const [showAllSources, setShowAllSources] = useState(false);

	if (!item.recyclingSources || item.recyclingSources.length === 0) return null;

	// Filter and sort sources
	// const buySources = [...item.sources]
	// 	.filter((source) => source.type === "buy")
	// 	.sort((a, b) => (b.count || 0) - (a.count || 0));

	// const recycleSources = [...item.sources]
	// 	.filter((source) => source.type === "recycle")
	// 	.sort((a, b) => (b.count || 0) - (a.count || 0));
	const recycleSources = item.recyclingSources;

	// Check if we need to show the "Show more/less" button
	const shouldShowToggle = recycleSources.length > 4;
	const displaySources = showAllSources ? recycleSources : recycleSources.slice(0, 4);

	// Create two separate arrays for left and right columns
	const halfLength = Math.ceil(displaySources.length / 2);
	const leftColumnSources = displaySources.slice(0, halfLength);
	const rightColumnSources = displaySources.slice(halfLength);

	return (
		<div className="w-full m-w-fit">
			<div className="font-mono font-light w-fit flex items-center gap-2 mb-2">
				<Link
					className="inline-block"
					size={24}
				/>
				<p>
					<span className="inline-block text-lg">Recycling Sources:</span>
					<span className="text-xs text-muted-foreground">
						{" "}
						({recycleSources?.length})
					</span>
				</p>
			</div>

			{/* {buySources.length > 0 && (
				<div className="w-full flex flex-col items-center gap-2">
					{buySources.map((source) => {
						return (
							<div
								key={source.trader + source.value + (source.count || 0)}
								className="flex items-center w-full gap-4 p-3 border rounded-md"
							>
								<span className="mb-1 font-bold">{source.trader}</span>
								<span>
									<MoveRight
										className="block"
										size={16}
									/>
								</span>
								<span className="flex items-center gap-1">
									<BadgeCent
										className="block"
										size={20}
									/>
									<span className="font-mono currency">
										{formatNumber(source.value)}
									</span>
								</span>
								<span>x{source?.count || 1}</span>
							</div>
						);
					})}
				</div>
			)} */}

			<ScrollArea className="w-fit min-w-full max-h[minmax(200px, 60vh)]">
				<div className="flex flex-col md:flex-row gap-2 md:gap-0 w-fit">
					{/* Left Column */}
					<div className="flex flex-col gap-2 md:pr-4">
						{leftColumnSources.map((source) => {
							const sourceItem = getItemById(source.itemId);
							if (!sourceItem) return null;
							return (
								<SourceItem
									key={sourceItem.id}
									sourceItem={sourceItem}
									item={item}
									source={source}
								/>
							);
						})}
					</div>

					{/* Divider */}
					{leftColumnSources.length > 0 && rightColumnSources.length > 0 && (
						<div className="hidden md:block w-px bg-secondary-foreground/20 dark:bg-secondary-foreground/10 mx-2"></div>
					)}

					{/* Right Column */}
					<div className="flex flex-col gap-2 md:pl-4">
						{rightColumnSources.map((source) => {
							const sourceItem = getItemById(source.itemId);
							if (!sourceItem) return null;
							return (
								<SourceItem
									key={sourceItem.id}
									sourceItem={sourceItem}
									item={item}
									source={source}
								/>
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
								Show {recycleSources.length - 4} more
							</>
						)}
					</Button>
				)}
			</ScrollArea>
		</div>
	);
}
