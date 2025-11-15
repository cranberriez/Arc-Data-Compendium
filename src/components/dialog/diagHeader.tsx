import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getRarityColor } from "@/utils/items/itemUtils";
import { DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { formatName, getTypeIcon } from "@/utils/items/itemUtils";
import getItemIcon from "@/components/items/getItemIcon";
import { ItemTagData } from "@/utils/items";
import { ItemImage } from "@/components/items/ItemImage";
import { Item } from "@/types";
import DiagDescription from "./diagDescription";

// Component that displays item header information
export const ItemHeader = ({ item, itemTags }: { item: Item; itemTags: ItemTagData[] }) => {
	const rarityColors = {
		bg: getRarityColor(item.rarity, "bg"),
		text: getRarityColor(item.rarity, "text"),
		border: getRarityColor(item.rarity, "border"),
	};

	const filteredTags = itemTags.filter((tag) => tag.key !== item.category);

	return (
		<DialogHeader className="flex flex-col justify-start gap-4">
			{/* Keep existing header content from DialogHeader */}
			<div className="flex flex-row items-center gap-4 sm:pr-2">
				<div className="flex flex-col items-start w-40 h-40">
					<ItemImage item={item} expectedSize={152} />
				</div>
				<div className="flex flex-col items-start gap-3">
					<DialogTitle className="text-left text-2xl font-normal pr-6 sm:pr-0">
						{item.name}
					</DialogTitle>
					{/* Desktop Tags */}
					<ItemDiagTags
						category={item.category}
						rarity={item.rarity}
						className="hidden sm:block"
						bgColor={rarityColors.bg}
						itemTags={filteredTags}
					/>

					<DiagDescription
						name={item.name}
						rarity={item.rarity}
						category={item.category}
						recipeId={item.recipeId}
						itemDescription={item.description}
						weight={item.weight}
						sellValue={item.value}
					/>
				</div>
			</div>
			{/* Mobile Tags */}
			<ItemDiagTags
				category={item.category}
				rarity={item.rarity}
				className="block sm:hidden"
				bgColor={rarityColors.bg}
				itemTags={filteredTags}
			/>
		</DialogHeader>
	);
};

export const ItemDiagTags = ({
	category,
	rarity,
	className,
	bgColor,
	itemTags,
}: {
	category: string;
	rarity: string;
	className?: string;
	bgColor?: string;
	itemTags: ItemTagData[];
}) => {
	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-1">
					<div className="flex items-center w-fit h-fit">
						{React.createElement(getTypeIcon(category), {
							size: 12,
						})}
					</div>
					<p className="text-sm text-muted-foreground font-mono">
						{formatName(category)}
					</p>
				</div>
				<div className="flex items-center gap-1">
					<div className={cn("w-3 h-3 rounded-full", bgColor)} />
					<p className="text-sm text-muted-foreground font-mono">{formatName(rarity)}</p>
				</div>

				{itemTags.map((tag) => {
					return (
						<div className="flex items-center gap-1" key={tag.key}>
							{tag.icon &&
								React.createElement(tag.icon, {
									className: cn(
										"w-4 h-4",
										tag.size === "lg" && "w-4 h-4",
										tag.size === "xl" && "w-5 h-5",
										tag.colorClass
									),
									strokeWidth: 2,
								})}
							<p className="text-sm text-muted-foreground font-mono">{tag.label}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
