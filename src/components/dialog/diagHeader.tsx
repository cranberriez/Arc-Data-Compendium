import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Item } from "@/types";
import { getRarityColor } from "@/utils/items/itemUtils";
import { DialogTitle } from "@/components/ui/dialog";
import { Book } from "lucide-react";
import React from "react";
import { formatName, getTypeIcon } from "@/utils/items/itemUtils";
import getItemIcon from "@/components/items/getItemIcon";
import { ItemTagData } from "@/utils/items";

// Component that displays item header information
export const ItemHeader = ({
	name,
	icon,
	category,
	rarity,
	recipeId,
	itemTags,
}: {
	name: string;
	icon: string;
	category: string;
	rarity: string;
	recipeId: string | null;
	itemTags: ItemTagData[];
}) => {
	const rarityColors = {
		bg: getRarityColor(rarity, "bg"),
		text: getRarityColor(rarity, "text"),
		border: getRarityColor(rarity, "border"),
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
					{getItemIcon(icon, cn("w-8 h-8", rarityColors.text))}
				</div>
				<div className="flex flex-col items-start">
					<DialogTitle className="text-left text-2xl font-normal pr-6 sm:pr-0">
						{name}
					</DialogTitle>
					<ItemDiagTags
						category={category}
						rarity={rarity}
						hasRecipe={!!recipeId}
						className="hidden sm:block"
						bgColor={rarityColors.bg}
						itemTags={itemTags}
					/>
				</div>
			</div>
			<ItemDiagTags
				category={category}
				rarity={rarity}
				hasRecipe={!!recipeId}
				className="block sm:hidden"
				bgColor={rarityColors.bg}
				itemTags={itemTags}
			/>
		</DialogHeader>
	);
};

export const ItemDiagTags = ({
	category,
	rarity,
	hasRecipe,
	className,
	bgColor,
	itemTags,
}: {
	category: string;
	rarity: string;
	hasRecipe: boolean;
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
						<div
							className="flex items-center gap-1"
							key={tag.key}
						>
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
