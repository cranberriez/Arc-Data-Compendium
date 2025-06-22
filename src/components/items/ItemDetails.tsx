"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getItemTags, ItemTag } from "./itemTags";

export interface ItemDetailsProps {
	/** The item to display */
	item: Item;
	/** Size variant */
	size?: "sm" | "md" | "lg" | "xl";
	/** Additional class names */
	className?: string;
	/** Whether to show the weight */
	showWeight?: boolean;
	/** Whether to show the value */
	showValue?: boolean;
	/** Whether to show craftable indicator */
	showCraftable?: boolean;
}

/**
 * ItemDetails component displays metadata about an item like weight, value, and craftable status
 */
export const ItemDetails = React.memo(function ItemDetails({
	item,
	size = "md",
	className,
	showWeight = true,
	showValue = true,
	showCraftable = true,
}: ItemDetailsProps) {
	// Icon size mapping based on component size
	const iconSize = React.useMemo(() => {
		switch (size) {
			case "sm":
				return 12;
			case "md":
				return 14;
			case "lg":
				return 16;
			case "xl":
				return 18;
			default:
				return 14;
		}
	}, [size]);

	// Text size mapping based on component size
	const textSizeClass = React.useMemo(() => {
		switch (size) {
			case "sm":
				return "text-xs";
			case "md":
				return "text-sm";
			case "lg":
				return "text-base";
			case "xl":
				return "text-lg";
			default:
				return "text-sm";
		}
	}, [size]);

	if (!item) return null;

	const tags = getItemTags(item);

	return (
		<div className={cn("flex flex-row items-center gap-3", "text-muted-foreground", className)}>
			{/* {showWeight && (
				<div className={cn("flex items-center gap-1", textSizeClass)}>
					<Weight
						size={iconSize}
						strokeWidth={3}
						aria-hidden="true"
					/>
					<span className="font-mono tabular-nums">{item.weight}kg</span>
				</div>
			)}

			{showValue && (
				<div className={cn("flex items-center gap-1", textSizeClass)}>
					<BadgeCent
						size={iconSize}
						strokeWidth={3}
						aria-hidden="true"
					/>
					<span className="font-mono tabular-nums">{item.value}</span>
				</div>
			)} */}

			{tags && (
				<TooltipProvider>
					{tags.map((tag) => (
						<ItemTag
							key={tag.key}
							label={tag.label}
							icon={tag.icon}
							colorClass={tag.colorClass}
							size={size}
						/>
					))}
				</TooltipProvider>
			)}
		</div>
	);
});

export default ItemDetails;
