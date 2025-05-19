"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book } from "lucide-react";
import { BaseItem } from "@/types/items/base";
import { formatName, getRarityColor, getTypeIcon } from "@/data/items/itemUtils";
import { useItemDialog } from "./item-dialog-context";
import { cn } from "@/lib/utils";

type ItemCardProps = { item?: BaseItem };

export function ItemCard({ item }: ItemCardProps) {
	const { openDialog } = useItemDialog();
	// Use the provided item or fallback to the first item in the datastore
	const displayItem = item;
	if (!displayItem) return null;

	const handleClick = () => {
		openDialog(displayItem);
	};

	return (
		<Card
			onClick={handleClick}
			className={`flex flex-row items-center gap-2 p-1 pr-2 rounded-lg w-full h-16 md:max-w-[300px] max-w-[400px] bg-transparent border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800`}
		>
			{/* Item Icon */}
			<div
				className={cn(
					"flex items-center justify-center rounded-md h-full border-2 p-2",
					getRarityColor(displayItem.rarity, "border")
				)}
			>
				{displayItem.icon && (
					<displayItem.icon
						className={cn("w-full h-full", getRarityColor(displayItem.rarity, "text"))}
					/>
				)}
			</div>
			<div className="flex flex-col flex-1 w-full h-full">
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div className="text-nowrap truncate max-w-[180px]">{displayItem.name}</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								{React.createElement(getTypeIcon(item.category), {
									size: 12,
								})}
							</TooltipTrigger>
							<TooltipContent side="right">
								<span>{formatName(item.category)}</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div className="text-sm text-muted-foreground">
						{formatName(displayItem.rarity)}
					</div>
					{displayItem.recipe && (
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
