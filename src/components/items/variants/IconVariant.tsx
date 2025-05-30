"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { getRarityColor } from "@/data/items/itemUtils";
import { ItemImage } from "../ItemImage";
import { ItemBadges } from "../ItemBadges";

export interface IconVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	count?: number;
	onClick?: () => void;
	className?: string;
	showBorder?: boolean;
}

/**
 * Icon variant - purely for showing only the icon with a background hue
 */
export const IconVariant = React.memo(function IconVariant({
	item,
	size = "md",
	count,
	onClick,
	className,
	showBorder,
}: IconVariantProps) {
	const iconSizeMap = {
		sm: "h-8 w-8",
		md: "h-12 w-12",
		lg: "h-16 w-16",
		xl: "h-20 w-20",
	};

	if (!item) return null;

	return (
		<div
			className={cn(
				"flex items-center justify-center",
				"border hover:border-primary/60 rounded",
				"cursor-pointer relative border-2",
				showBorder ? `${getRarityColor(item.rarity, "border")}` : `border-transparent`,
				iconSizeMap[size],
				className
			)}
			onClick={onClick}
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
			<ItemImage
				item={item}
				size={size === "sm" ? "sm" : size === "md" ? "md" : size === "lg" ? "lg" : "xl"}
				showBorder={false}
				containerClassName="p-0"
			/>

			{count !== undefined && (
				<ItemBadges
					item={item}
					count={count}
					size={size}
					position="top-right"
				/>
			)}
		</div>
	);
});

export default IconVariant;
