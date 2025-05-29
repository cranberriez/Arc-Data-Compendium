"use client";

import * as React from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ItemImage } from "../ItemImage";
import { ItemContent } from "../ItemContent";
import { ItemBadges } from "../ItemBadges";

export interface DetailedVariantProps {
	item: Item;
	size?: "sm" | "md" | "lg" | "xl";
	orientation?: "horizontal" | "vertical";
	count?: number;
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
			<div className="flex flex-col gap-2 w-full">
				{/* Main content row */}
				<div
					className={cn(
						"flex w-full",
						orientation === "horizontal"
							? "flex-row items-start gap-3"
							: "flex-col items-center gap-2"
					)}
				>
					<div
						className={cn(
							"relative",
							orientation === "vertical" && "flex justify-center w-full"
						)}
					>
						<ItemImage
							item={item}
							size={size === "sm" ? "md" : size === "md" ? "lg" : "xl"}
							showBorder={true}
						/>
						{count !== undefined && (
							<ItemBadges
								item={item}
								count={count}
								size={size}
								position="top-right"
								showRarity={true}
							/>
						)}
					</div>

					<div
						className={cn(
							"flex-1 min-w-0 h-full",
							orientation === "vertical" && "w-full"
						)}
					>
						<ItemContent
							item={item}
							size={size}
							orientation="vertical"
							showDetails={true}
							truncate={false}
							className={orientation === "vertical" ? "items-center text-center" : ""}
						/>
					</div>
				</div>

				{/* Description row - now on a separate row to fill horizontal space */}
				{item.description && (
					<div className="w-full mt-1">
						<p
							className={cn(
								"text-muted-foreground",
								size === "sm" && "text-xs",
								size === "md" && "text-sm",
								size === "lg" && "text-base",
								size === "xl" && "text-lg",
								orientation === "vertical" && "text-center"
							)}
						>
							{item.description}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
});

export default DetailedVariant;
