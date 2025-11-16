"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getRarityColor } from "@/utils/items/itemUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ItemBadgesProps {
	/** The item to display */
	item: Item;
	/** Count of items to display */
	count?: string;
	/** Size variant */
	size?: "sm" | "md" | "lg" | "xl";
	/** Additional class names */
	className?: string;
	/** Position of the badges */
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "standalone";
	/** Whether to show the rarity badge */
	showRarity?: boolean;
}

/**
 * ItemBadges component displays badges like count, rarity, etc.
 */
export const ItemBadges = React.memo(function ItemBadges({
	item,
	count,
	size = "md",
	className,
	position = "top-right",
	showRarity = false,
}: ItemBadgesProps) {
	// Size mapping for badges
	const sizeClasses = React.useMemo(() => {
		switch (size) {
			case "sm":
				return "text-[0.65rem] px-1 py-0 min-w-4 h-4";
			case "md":
				return "text-xs px-1.5 py-0 min-w-5 h-5";
			case "lg":
				return "text-sm px-2 py-0.5 min-w-6 h-6";
			case "xl":
				return "text-base px-2.5 py-1 min-w-7 h-7";
			default:
				return "text-xs px-1.5 py-0 min-w-5 h-5";
		}
	}, [size]);

	// Position mapping for badges container with improved alignment
	const positionClasses = React.useMemo(() => {
		// Adjust translation values for better alignment outside the card
		switch (position) {
			case "top-left":
				return "absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 z-10";
			case "top-right":
				return "absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 z-10";
			case "bottom-left":
				return "absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 z-10";
			case "bottom-right":
				return "absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 z-10";
			case "standalone":
				return ""; // No positioning, use as a standalone component
			default:
				return "absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 z-10";
		}
	}, [position]);

	// Determine if we have any badges to show
	const hasBadges = count !== undefined || showRarity;

	if (!item || !hasBadges) return null;

	return (
		<div
			className={cn("flex flex-col gap-1 z-10", positionClasses, className)}
			aria-label="Item badges"
		>
			{count !== undefined && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Badge
								variant="secondary"
								className={cn(
									"flex items-center justify-center font-mono",
									sizeClasses
								)}
							>
								{typeof count === "number" && count > 99 ? "99+" : count}
							</Badge>
						</TooltipTrigger>
						<TooltipContent>
							<p># of Items Produced/Consumed</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			{showRarity && typeof item.rarity === "number" && item.rarity > 0 && (
				<Badge
					className={cn(
						"flex items-center justify-center",
						sizeClasses,
						getRarityColor(item.rarity, "bg"),
						"text-white"
					)}
				>
					{item.rarity}
				</Badge>
			)}
		</div>
	);
});

export default ItemBadges;
