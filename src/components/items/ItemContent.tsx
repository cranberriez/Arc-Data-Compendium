"use client";

import * as React from "react";
import { useMemo } from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { ItemHeader } from "./ItemHeader";
import { ItemDetails } from "./ItemDetails";

export interface ItemContentProps {
	/** The item to display */
	item: Item;
	/** Layout orientation */
	orientation?: "horizontal" | "vertical";
	/** Size variant */
	size?: "sm" | "md" | "lg" | "xl";
	/** Additional class names */
	className?: string;
	/** Whether to show details section */
	showDetails?: boolean;
	/** Whether to truncate text */
	truncate?: boolean;
}

/**
 * ItemContent component displays the textual information about an item
 * including its name, category, and details like weight and value
 */
export const ItemContent = React.memo(function ItemContent({
	item,
	orientation = "vertical",
	size = "md",
	className,
	showDetails = true,
	truncate = true,
}: ItemContentProps) {
	// Determine text size based on component size
	const textSizeClass = useMemo(() => {
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

	return (
		<div
			className={cn(
				"flex min-w-0 h-full",
				orientation === "vertical"
					? "flex-col justify-around"
					: "flex-row items-center justify-between",
				className
			)}
		>
			<ItemHeader
				item={item}
				size={size}
				truncate={truncate}
				className={cn(orientation === "horizontal" && "flex-1 min-w-0", textSizeClass)}
			/>

			{showDetails && (
				<ItemDetails
					item={item}
					size={size}
					className={cn(orientation === "vertical" ? "mt-1" : "ml-auto", textSizeClass)}
				/>
			)}
		</div>
	);
});

export default ItemContent;
