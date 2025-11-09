"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { getRarityColor } from "@/utils/items/itemUtils";
import { ItemImage } from "../ItemImage";
import { ItemBadges } from "../ItemBadges";

export interface IconVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	count?: number;
	onClick?: () => void;
	className?: string;
	showBorder?: boolean;
	orientation?: string;
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
	orientation,
}: IconVariantProps) {
	const iconSizeMap = {
		sm: "h-8 w-8",
		md: "h-12 w-12",
		lg: "h-16 w-16",
		xl: "h-20 w-20",
	};

	const iconWideSizeMap = {
		sm: "h-10 w-64",
		md: "h-14 w-64",
		lg: "h-18 w-64",
		xl: "h-22 w-64",
	};

	if (!item) return null;

	return orientation === "vertical" ? (
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
				<ItemBadges item={item} count={count} size={size} position="top-right" />
			)}
		</div>
	) : (
		// Horizontal Variant
		<div
			className={cn(
				"flex items-center justify-start gap-2 min-w-0",
				"border hover:border-primary/40 hover:bg-primary/10 rounded",
				"cursor-pointer relative border-2 p-2 transition-colors",
				showBorder ? `${getRarityColor(item.rarity, "border")}` : `border-transparent`,
				iconWideSizeMap[size],
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
				<span className="text-base text-right font-mono min-w-6 w-6">{count}</span>
			)}
			<span className="text-base text-nowrap truncate">{item.name}</span>
		</div>
	);
});

export default IconVariant;
