"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Book } from "lucide-react";
import {
	Item,
	getRarityColor,
	getRarityBorder,
	formatName,
	getTypeIcon,
	placeholderItem,
} from "@/data/items/types";

type ItemCardProps = { item?: Item };

export function ItemCard({ item }: ItemCardProps) {
	// Use the provided item or fallback to the first item in the datastore
	const displayItem = item || placeholderItem;
	const rarityColor = getRarityColor(displayItem.rarity);
	const rarityBorder = getRarityBorder(displayItem.rarity);
	const itemTypeIcon = getTypeIcon(displayItem.type);

	return (
		<Card
			className={`flex flex-row items-center gap-2 p-1 pr-2 rounded-lg w-full h-16 md:max-w-[300px] max-w-[400px] bg-transparent border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800`}
		>
			{/* Item Icon */}
			<div
				className={cn(
					"flex items-center justify-center rounded-sm h-full aspect-square border-2",
					rarityBorder
				)}
			>
				{displayItem.icon && <displayItem.icon className={rarityColor} />}
			</div>
			<div className="flex flex-col flex-1 w-full h-full">
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div className="text-nowrap truncate max-w-[180px]">
						{displayItem.display_name}
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>{itemTypeIcon}</TooltipTrigger>
							<TooltipContent side="right">
								<span>{formatName(displayItem.type)}</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div className="text-sm text-muted-foreground">
						{formatName(displayItem.rarity)}
					</div>
					{displayItem.craftable && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="w-4 h-4 flex items-center justify-center">
									<Book className="w-3 h-3" />
								</TooltipTrigger>
								<TooltipContent side="right">
									<span>Craftable</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			</div>
		</Card>
	);
}
