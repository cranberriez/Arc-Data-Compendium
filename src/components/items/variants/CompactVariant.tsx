"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { ItemImage } from "../ItemImage";
import { ItemBadges } from "../ItemBadges";

export interface CompactVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	count?: number;
	onClick?: () => void;
	className?: string;
}

/**
 * Compact variant - functions like the previous icon mode (showing icon, name, and count)
 */
export const CompactVariant = React.memo(function CompactVariant({
	item,
	size = "md",
	count,
	onClick,
	className,
}: CompactVariantProps) {
	// Size mappings for the container
	const sizeClasses = {
		sm: "min-w-[60px] max-h-[100px] p-1.5",
		md: "min-w-[70px] max-h-[120px] p-2",
		lg: "min-w-[80px] max-h-[140px] p-2.5",
		xl: "min-w-[90px] max-h-[160px] p-3",
	};

	// Text size mappings
	const textClasses = {
		sm: "text-xs line-clamp-2",
		md: "text-xs line-clamp-2",
		lg: "text-sm line-clamp-2",
		xl: "text-base line-clamp-2",
	};

	if (!item) return null;

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-between relative",
				"border-2 hover:border-primary/60 rounded aspect-square cursor-pointer",
				"border-secondary-foreground/20",
				sizeClasses[size],
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
			<div className="flex items-center justify-center mt-1">
				<ItemImage
					item={item}
					size={size === "sm" ? "md" : size === "md" ? "lg" : size === "lg" ? "xl" : "xl"}
					showBorder={false}
				/>
			</div>

			{count !== undefined && (
				<ItemBadges
					item={item}
					count={count}
					size={size}
					position="top-right"
				/>
			)}

			<span
				className={cn(
					"text-center font-mono leading-tight break-words overflow-hidden mt-1",
					textClasses[size]
				)}
				title={item.name}
			>
				{item.name}
			</span>
		</div>
	);
});

export default CompactVariant;
