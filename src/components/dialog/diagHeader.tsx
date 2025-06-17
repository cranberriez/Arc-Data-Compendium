import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Item } from "@/types";
import { getRarityColor } from "@/data/items/itemUtils";
import { DialogTitle } from "@/components/ui/dialog";
import { Book } from "lucide-react";
import React from "react";
import { formatName, getTypeIcon } from "@/data/items/itemUtils";
import getItemIcon from "@/components/items/getItemIcon";

// Component that displays item header information
export const ItemHeader = ({ item }: { item: Item }) => {
	const rarityColors = {
		bg: getRarityColor(item.rarity, "bg"),
		text: getRarityColor(item.rarity, "text"),
		border: getRarityColor(item.rarity, "border"),
	};

	return (
		<DialogHeader className="flex flex-col justify-start gap-4">
			{/* Keep existing header content from DialogHeader */}
			<div className="flex flex-row items-center gap-4 sm:pr-2">
				<div
					className={cn(
						"flex items-center justify-center rounded-lg w-16 h-16 border-2 p-2",
						rarityColors.border,
						rarityColors.text,
						`dark:${rarityColors.bg}/10`
					)}
				>
					{getItemIcon(item.icon, cn("w-8 h-8", rarityColors.text))}
				</div>
				<div className="flex flex-col items-start">
					<DialogTitle className="text-left text-2xl font-normal pr-6 sm:pr-0">
						{item.name}
					</DialogTitle>
					<ItemTags
						item={item}
						className="hidden sm:block"
						bgColor={rarityColors.bg}
					/>
				</div>
			</div>
			<ItemTags
				item={item}
				className="block sm:hidden"
				bgColor={rarityColors.bg}
			/>
		</DialogHeader>
	);
};

export const ItemTags = ({
	item,
	className,
	bgColor,
}: {
	item: Item;
	className?: string;
	bgColor?: string;
}) => {
	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<div className="flex items-center w-fit h-fit">
						{React.createElement(getTypeIcon(item.category), {
							size: 12,
						})}
					</div>
					<p className="text-sm text-muted-foreground font-mono">
						{formatName(item.category)}
					</p>
				</div>
				<div className="flex items-center gap-1">
					<div className={cn("w-3 h-3 rounded-full", bgColor)} />
					<p className="text-sm text-muted-foreground font-mono">
						{formatName(item.rarity)}
					</p>
				</div>

				{item.recipeId && (
					<div className="flex items-center gap-1">
						<div className="w-fit h-fit">
							<Book size={12} />
						</div>
						<p className="text-sm text-muted-foreground font-mono">Craftable</p>
					</div>
				)}
			</div>
		</div>
	);
};
