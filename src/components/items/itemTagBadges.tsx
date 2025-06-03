import { Item } from "@/types";
import { RecycleIcon, Book, LucideIcon, Boxes, ShoppingBasket, Hammer, Scroll } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

export type DescriptorBadgeData = {
	key: string;
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	size?: "sm" | "md" | "lg" | "xl";
};

export function getDescriptorBadges(item: Item): DescriptorBadgeData[] {
	const badges: DescriptorBadgeData[] = [];

	if (item.recycling && item.recycling.length > 0) {
		badges.push({
			key: "recyclable",
			label: "Is Recyclable",
			icon: RecycleIcon,
			colorClass: "text-green-800 dark:text-green-200",
		});
	}
	if (item.recipeId) {
		badges.push({
			key: "craftable",
			label: "Is Craftable",
			icon: Book,
			colorClass: "text-blue-800 dark:text-blue-200",
		});
	}

	if (item.sources && item.sources.length > 0) {
		// Badge for recycle sources
		if (item.sources.some((src) => src.type === "recycle")) {
			badges.push({
				key: "sources-recycle",
				label: "Has Recycle Source",
				icon: Boxes,
				colorClass: "text-emerald-800 dark:text-emerald-200",
			});
		}
		// Badge for buy sources
		if (item.sources.some((src) => src.type === "buy")) {
			badges.push({
				key: "sources-buy",
				label: "Can Be Bought",
				icon: ShoppingBasket,
				colorClass: "text-amber-800 dark:text-amber-200",
			});
		}
	}

	// Badge for workbench use
	if (item.uses && item.uses.some((use) => use.type === "workbench")) {
		badges.push({
			key: "use-workbench",
			label: "Workbench Upgrade Item",
			icon: Hammer,
			colorClass: "text-lime-800 dark:text-lime-200",
		});
	}
	// Badge for quest use
	if (item.uses && item.uses.some((use) => use.type === "quest")) {
		badges.push({
			key: "use-quest",
			label: "Quest Item",
			icon: Scroll,
			colorClass: "text-purple-800 dark:text-purple-200",
		});
	}

	return badges;
}

type DescriptorBadgeProps = {
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export const DescriptorBadge: React.FC<DescriptorBadgeProps> = ({
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
