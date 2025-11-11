"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ItemImage } from "../ItemImage";
import { ItemContent } from "../ItemContent";
import ItemBadges from "../ItemBadges";

export interface DefaultVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	count?: number;
	onClick?: () => void;
	className?: string;
}

/**
 * Default variant - standard card layout with maximized icon size
 */
export const DefaultVariant = React.memo(function DefaultVariant({
	item,
	size = "md",
	count,
	onClick,
	className,
}: DefaultVariantProps) {
	if (!item) return null;

	return (
		<Card
			onClick={onClick}
			className={cn(
				"flex flex-row items-center gap-2 rounded-lg w-full",
				"bg-transparent border-zinc-700 cursor-pointer",
				"hover:bg-zinc-100 dark:hover:bg-zinc-800",
				"max-w-full sm:max-w-[400px] md:max-w-[500px] relative",
				size === "sm" && "h-12 gap-1 p-0.5 pr-2",
				size === "md" && "h-16 gap-2 p-0.5 pr-2",
				size === "lg" && "h-20 gap-3 p-1 pr-3",
				size === "xl" && "h-24 gap-4 p-1 pr-4",
				className
			)}
			role="button"
			aria-label={`Select ${item.name}`}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
		>
			{/* Optimized icon sizing that fills the available height */}
			<div
				className={cn(
					"h-full aspect-square",
					size === "sm" && "rounded-sm",
					size === "md" && "rounded-md",
					size === "lg" && "rounded-md",
					size === "xl" && "rounded-lg"
				)}
				style={{
					background: `radial-gradient(circle at right top, transparent 75%, var(--color-${item.rarity.toLowerCase()})) 100%`,
				}}
			>
				<ItemImage
					item={item}
					size={size === "sm" ? "sm" : size === "md" ? "md" : size === "lg" ? "lg" : "xl"}
					showBorder={true}
					containerClassName="h-full"
				/>
			</div>

			<ItemContent
				item={item}
				size={size}
				orientation="vertical"
				showDetails={true}
				truncate={true}
				className="flex-1 h-full min-w-0"
			/>

			{count !== undefined && (
				<ItemBadges item={item} count={count} size={size} position="top-left" />
			)}
		</Card>
	);
});

export default DefaultVariant;
