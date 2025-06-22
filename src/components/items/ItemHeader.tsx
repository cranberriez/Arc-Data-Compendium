"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getTypeIcon, formatName } from "@/utils/items/itemUtils";

export interface ItemHeaderProps {
	/** The item to display */
	item: Item;
	/** Size variant */
	size?: "sm" | "md" | "lg" | "xl";
	/** Additional class names */
	className?: string;
	/** Whether to truncate text */
	truncate?: boolean;
	/** Whether to show category icon */
	showCategory?: boolean;
}

/**
 * ItemHeader component displays the item name and category icon
 */
export const ItemHeader = React.memo(function ItemHeader({
	item,
	size = "md",
	className,
	truncate = true,
	showCategory = true,
}: ItemHeaderProps) {
	// Determine font size based on component size
	const fontSizeClass = React.useMemo(() => {
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

	// Get the icon component for the item category
	const TypeIcon = React.useMemo(() => getTypeIcon(item.category), [item.category]);

	// Size mapping for the category icon
	const iconSize = React.useMemo(() => {
		switch (size) {
			case "sm":
				return 14;
			case "md":
				return 16;
			case "lg":
				return 18;
			case "xl":
				return 20;
			default:
				return 16;
		}
	}, [size]);

	if (!item) return null;

	return (
		<div className={cn("flex flex-row items-center justify-between", className)}>
			<div
				className={cn(fontSizeClass, truncate && "truncate", "max-w-[85%]")}
				title={truncate ? item.name : undefined}
			>
				{item.name}
			</div>

			{showCategory && (
				<TooltipProvider>
					<Tooltip delayDuration={300}>
						<TooltipTrigger asChild>
							<div
								className="flex items-center justify-center"
								aria-label={`Category: ${formatName(item.category)}`}
							>
								<TypeIcon size={iconSize} />
							</div>
						</TooltipTrigger>
						<TooltipContent
							side="right"
							align="center"
						>
							<span>{formatName(item.category)}</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
});

export default ItemHeader;
