"use client";

import { Item } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { SourceItem } from "./diagSourceItem";
import { Link } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type SourcesSectionProps = {
	item: Item;
};

export function SourcesSection({ item }: SourcesSectionProps) {
	const { getItemById } = useItems();

	if (!item.sources || item.sources.length === 0) return null;

	// Filter and sort sources
	const filteredSources = [...item.sources]
		.filter((source) => source.type !== "buy")
		.sort((a, b) => (b.count || 0) - (a.count || 0));

	// Create two separate arrays for left and right columns
	const halfLength = Math.ceil(filteredSources.length / 2);
	const leftColumnSources = filteredSources.slice(0, halfLength);
	const rightColumnSources = filteredSources.slice(halfLength);

	return (
		<div className="w-fit">
			<div className="font-mono font-light w-fit flex items-center gap-2 mb-2">
				<Link
					className="inline-block"
					size={24}
				/>
				<p>
					<span className="inline-block text-lg">Sources:</span>
					<span className="text-xs text-muted-foreground">
						{" "}
						({filteredSources.length})
					</span>
				</p>
			</div>

			<ScrollArea className="w-fit max-h[minmax(200px, 60vh)]">
				<div className="flex flex-col md:flex-row gap-2 md:gap-0 w-fit">
					{/* Left Column */}
					<div className="flex flex-col gap-2 md:pr-4">
						{leftColumnSources.map((source) => {
							const sourceItem = getItemById(source.fromItemId);
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
							const sourceItem = getItemById(source.fromItemId);
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
			</ScrollArea>
		</div>
	);
}
