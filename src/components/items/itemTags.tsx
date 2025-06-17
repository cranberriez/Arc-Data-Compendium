import { Item, RecipeRow } from "@/types";
import { RecycleIcon, Book, LucideIcon, Boxes, ShoppingBasket, Hammer, Scroll } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

export type ItemTagData = {
	key: string;
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	size?: "sm" | "md" | "lg" | "xl";
};

export function getItemTags(item: Item): ItemTagData[] {
	const tags: ItemTagData[] = [];

	const uses: { type: string }[] = []; // add item.uses when its implemented
	const sources: { type: string }[] = []; // add item.sources when its implemented
	const recycling: RecipeRow[] = item.recycling || []; // add item.recycling when its implemented

	// Quest use
	if (uses.some((use) => use.type === "quest")) {
		tags.push({
			key: "use-quest",
			label: "Quest Item",
			icon: Scroll,
			colorClass: "text-purple-800 dark:text-purple-200",
		});
	}

	// Workbench use
	if (uses.some((use) => use.type === "workbench")) {
		tags.push({
			key: "use-workbench",
			label: "Workbench Upgrade Item",
			icon: Hammer,
			colorClass: "text-lime-800 dark:text-lime-200",
		});
	}

	if (recycling.length > 0) {
		tags.push({
			key: "recyclable",
			label: "Is Recyclable",
			icon: RecycleIcon,
			colorClass: "text-green-800 dark:text-green-200",
		});
	}

	if (item.recipeId) {
		tags.push({
			key: "craftable",
			label: "Is Craftable",
			icon: Book,
			colorClass: "text-blue-800 dark:text-blue-200",
		});
	}

	if (sources.length > 0) {
		// Badge for recycle sources
		if (sources.some((src) => src.type === "recycle")) {
			tags.push({
				key: "sources-recycle",
				label: "Has Recycle Source",
				icon: Boxes,
				colorClass: "text-emerald-800 dark:text-emerald-200",
			});
		}
		// Badge for buy sources
		if (sources.some((src) => src.type === "buy")) {
			tags.push({
				key: "sources-buy",
				label: "Can Be Bought",
				icon: ShoppingBasket,
				colorClass: "text-amber-800 dark:text-amber-200",
			});
		}
	}

	return tags;
}

type ItemTagProps = {
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export const ItemTag: React.FC<ItemTagProps> = ({
	label,
	icon,
	colorClass,
	className,
	size = "md",
}) => (
	<TooltipProvider>
		<div className={cn("flex items-center justify-center rounded", colorClass, className)}>
			<Tooltip delayDuration={150}>
				<TooltipTrigger asChild>
					<div
						className="flex items-center justify-center"
						aria-label={label}
					>
						{icon &&
							React.createElement(icon, {
								className: cn(
									"w-4 h-4",
									size === "lg" && "w-4 h-4",
									size === "xl" && "w-5 h-5"
								),
								strokeWidth: 2,
							})}
					</div>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					align="center"
				>
					<span>{label}</span>
				</TooltipContent>
			</Tooltip>
		</div>
	</TooltipProvider>
);
