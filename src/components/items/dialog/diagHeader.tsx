import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Item } from "@/types";
import { getRarityColor } from "@/data/items/itemUtils";
import { DialogTitle } from "@/components/ui/dialog";
import { Book } from "lucide-react";
import React from "react";
import { formatName, getTypeIcon } from "@/data/items/itemUtils";

// Component that displays item header information
export const ItemHeader = ({ item }: { item: Item }) => {
	const ItemIcon = item.icon;

	return (
		<DialogHeader className="flex flex-row items-center gap-4 pr-2">
			{/* Keep existing header content from DialogHeader */}
			<div
				className={cn(
					"flex items-center justify-center rounded-lg w-16 h-16 border-2 p-2",
					getRarityColor(item.rarity, "border"),
					getRarityColor(item.rarity, "text"),
					`dark:${getRarityColor(item.rarity, "bg")}/10`
				)}
			>
				{ItemIcon && <ItemIcon className="w-10 h-10" />}
			</div>
			<div className="flex flex-col items-start">
				<DialogTitle className="text-2xl font-mono font-light">{item.name}</DialogTitle>
				<div className="space-y-4">
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
							<div
								className={cn(
									"w-3 h-3 rounded-full",
									getRarityColor(item.rarity, "bg")
								)}
							/>
							<p className="text-sm text-muted-foreground font-mono">
								{formatName(item.rarity)}
							</p>
						</div>

						{item.recipe && (
							<div className="flex items-center gap-1">
								<div className="w-fit h-fit">
									<Book size={12} />
								</div>
								<p className="text-sm text-muted-foreground font-mono">Craftable</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</DialogHeader>
	);
};
