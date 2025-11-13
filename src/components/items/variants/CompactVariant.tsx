"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { ItemImage } from "../ItemImage";
import { ItemBadges } from "../ItemBadges";
import { getRarityColor } from "@/utils/items/itemUtils";

export interface CompactVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	count?: string;
	innerCount?: boolean;
	onClick?: () => void;
	showBorder?: boolean;
	orientation?: string;
	className?: string;
}

/**
 * Compact variant - functions like the previous icon mode (showing icon, name, and count)
 */
export const CompactVariant = React.memo(function CompactVariant({
	item,
	size = "md",
	count,
	innerCount,
	onClick,
	showBorder,
	orientation,
	className,
}: CompactVariantProps) {
	// Size mappings for the container
	const sizeClasses = {
		sm: "min-w-[60px] h-[80px] max-h-[100px]",
		md: "min-w-[70px] h-[100px] max-h-[120px]",
		lg: "min-w-[80px] h-[120px] max-h-[140px]",
		xl: "min-w-[90px] h-[140px] max-h-[160px]",
	};

	const paddingClasses = {
		sm: "p-1.5",
		md: "p-2",
		lg: "p-2.5",
		xl: "p-3",
	};

	// Text size mappings
	const textClasses = {
		sm: "text-xs line-clamp-2",
		md: "text-sm line-clamp-2",
		lg: "text-base line-clamp-2",
		xl: "text-lg line-clamp-2",
	};

	if (!item) return null;

	return (
		<div
			className={cn(
				`${
					orientation === "horizontal"
						? "flex flex-row h-fit items-center gap-2"
						: "flex flex-col items-center justify-between aspect-square gap-1"
				}`,
				"relative border-2 hover:border-primary/60 rounded cursor-pointer",
				showBorder ? getRarityColor(item.rarity, "border") : "border-transparent",
				orientation === "horizontal" ? "" : sizeClasses[size],
				paddingClasses[size],
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
			<div className="flex items-center justify-center absolute h-full w-full top-0 left-0 z-1">
				<ItemImage item={item} showBorder={false} expectedSize={64} />
			</div>

			{count !== undefined && orientation === "vertical" && (
				<ItemBadges
					item={item}
					count={count}
					size={size === "sm" ? "md" : size === "md" ? "lg" : size === "lg" ? "xl" : "xl"}
					position="top-right"
				/>
			)}

			{orientation === "horizontal" && (
				<span
					className={cn(
						"leading-tight text-nowrap w-[30px]",
						textClasses[size],
						"text-md"
					)}
				>
					{count}
				</span>
			)}

			<span
				className={cn(
					"font-mono leading-tight break-words overflow-hidden z-2 absolute bottom-0 left-0 right-0",
					orientation === "horizontal" ? "text-left" : "text-center",
					textClasses[size]
				)}
				title={item.name}
				style={{
					textShadow: `0px 0px 4px rgba(0, 0, 0, 1)`,
				}}
			>
				{item.name}
			</span>
		</div>
	);
});

export default CompactVariant;
