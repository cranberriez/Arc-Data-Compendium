"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ItemImage } from "../ItemImage";
import { ItemHeader } from "../ItemHeader";
import { ItemDetails } from "../ItemDetails";

export interface DetailedVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	orientation?: "horizontal" | "vertical";
	count?: string;
	onClick?: () => void;
	className?: string;
}

/**
 * Detailed variant - expanded information with description on separate row
 */
export const DetailedVariant = React.memo(function DetailedVariant({
	item,
	size = "md",
	orientation = "horizontal",
	count,
	onClick,
	className,
}: DetailedVariantProps) {
	if (!item) return null;

	const imageSizes = {
		sm: "w-12 h-12",
		md: "w-16 h-16",
		lg: "w-20 h-20",
		xl: "w-24 h-24",
	};

	return (
		<Card
			className={cn(
				"p-3 cursor-pointer bg-muted/20 border-1 hover:border-zinc-700 transition-colors rounded-md",
				size === "sm" && "p-2",
				size === "xl" && "p-4",
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
			<div className="flex gap-2 w-full min-w-0 flex-wrap">
				<div className={`flex items-center gap-2 ${imageSizes[size]}`}>
					<ItemImage item={item} showBorder={true} />
				</div>
				<div className="flex flex-col flex-1 gap-2">
					<ItemHeader item={item} size={size} truncate={true} className="flex-1" />
					<ItemDetails item={item} size={size} className="flex-1" />
				</div>
			</div>
		</Card>
	);
});

export default DetailedVariant;
