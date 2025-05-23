"use client";

import * as React from "react";
import { useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book, BadgeCent, Weight } from "lucide-react";
import { Item } from "@/types";
import { formatName, getRarityColor, getTypeIcon } from "@/data/items/itemUtils";
import { cn } from "@/lib/utils";
import { useDialog } from "@/contexts/dialogContext";
import { getItemImagePath } from "@/utils/itemImage";
import { Skeleton } from "../ui/skeleton";

const USE_ACTUAL_IMAGES = true;

type ItemCardProps = {
	item?: Item;
	variant?: "default" | "icon";
	count?: number;
	onClick?: () => void;
	className?: string;
};

const ItemCardComponent = React.memo(
	function ItemCard({
		item,
		variant = "default",
		count = undefined,
		onClick,
		className,
	}: ItemCardProps) {
		const { openDialog } = useDialog();
		const handleClick = onClick || (() => openDialog("item", item));
		const [imageError, setImageError] = React.useState(false);

		// Check if item has an image, otherwise use the icon
		const itemImage = useMemo(() => {
			if (!item) return null;

			const imagePath = getItemImagePath(item.id);
			if (USE_ACTUAL_IMAGES && imagePath && !imageError) {
				return (
					<div className="relative w-full h-full">
						<Image
							src={imagePath}
							alt={item.name}
							fill
							className="object-contain"
							sizes="64px"
							unoptimized={process.env.NODE_ENV !== "production"}
							onError={() => setImageError(true)}
						/>
					</div>
				);
			}

			// Fallback to icon if no image found
			if (item?.icon) {
				return <item.icon className={cn("w-8 h-8", getRarityColor(item.rarity, "text"))} />;
			}

			return null;
		}, [item]);

		// Memoize the border color for icon variant
		const borderClass = useMemo(
			() => (item ? getRarityColor(item.rarity, "border") : undefined),
			[item]
		);

		if (!item) return null;

		if (variant === "icon") {
			return (
				<div
					className={cn(
						"flex flex-col items-center justify-between border-2 hover:border-primary/60 rounded p-2 min-w-[60px] aspect-square cursor-pointer",
						borderClass,
						"border-secondary-foreground/20",
						className
					)}
					onClick={handleClick}
				>
					<div className="flex items-center gap-1">
						{itemImage}
						{count !== undefined && (
							<span className="text-lg font-mono text-center">
								x{count > 0 ? count : "?"}
							</span>
						)}
					</div>
					<span
						className="text-xs font-mono text-center w-[70px] h-[32px] leading-tight break-words line-clamp-2 overflow-hidden"
						title={item.name}
					>
						{item.name}
					</span>
				</div>
			);
		}

		// Variant: Default
		return (
			<Card
				onClick={handleClick}
				className={cn(
					"flex flex-row items-center gap-2 p-1 pr-2 max-w-full sm:max-w-[300px] md:max-w-[400px] rounded-lg w-full h-16 bg-transparent border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800",
					className
				)}
			>
				{/* Item Image/Icon */}
				<div
					className={cn(
						"flex items-center justify-center rounded-sm h-full aspect-square border-2 p-[2px]",
						getRarityColor(item.rarity, "border"),
						`${getRarityColor(item.rarity, "bg")}/10`
					)}
				>
					{itemImage}
					{/* {(() => {
						const imagePath = getItemImagePath(item.id);
						if (imagePath) {
							return (
								<div className="relative w-full h-full">
									<Image
										src={imagePath}
										alt={item.name}
										fill
										className="object-contain"
										sizes="48px"
										unoptimized={process.env.NODE_ENV !== "production"}
									/>
								</div>
							);
						}
						if (item.icon) {
							return (
								<item.icon
									className={cn(
										"h-full aspect-square",
										getRarityColor(item.rarity, "text")
									)}
								/>
							);
						}
						return null;
					})()} */}
				</div>
				<div className="flex flex-col flex-1 h-full min-w-0">
					<div className="flex flex-1 flex-row items-center justify-between">
						<div className="text-nowrap truncate max-w-[85%]">{item.name}</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									{React.createElement(getTypeIcon(item.category), {
										size: 16,
									})}
								</TooltipTrigger>
								<TooltipContent side="right">
									<span>{formatName(item.category)}</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className="min-w-fit flex flex-1 flex-row items-center gap-3">
						<div className="text-sm text-muted-foreground flex items-center gap-1">
							<Weight
								size={14}
								strokeWidth={3}
							/>
							<span className="text-sm font-mono tabular-nums">{item.weight}kg</span>
						</div>
						<div className="text-sm text-muted-foreground flex items-center gap-1">
							<div className="text-sm text-muted-foreground flex items-center gap-1">
								<BadgeCent
									size={14}
									strokeWidth={3}
								/>
								<span className="text-sm font-mono tabular-nums">{item.value}</span>
							</div>
						</div>
						{item.recipeId && (
							<div className="ml-auto text-amber-600 dark:text-amber-300">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="w-4 h-4 flex items-center justify-center">
											<Book
												className="w-3 h-3"
												strokeWidth={4}
											/>
										</TooltipTrigger>
										<TooltipContent side="right">
											<span>Craftable</span>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						)}
					</div>
				</div>
			</Card>
		);
	},
	(prevProps, nextProps) => {
		// Only re-render if these props change
		return (
			prevProps.item?.id === nextProps.item?.id &&
			prevProps.variant === nextProps.variant &&
			prevProps.count === nextProps.count
		);
	}
);

// Create a skeleton card to show during loading
const ItemCardSkeleton = () => {
	return (
		<Card className="flex flex-row items-center gap-2 p-1 pr-2 max-w-[300px] md:max-w-[400px] rounded-lg w-full h-16 bg-transparent border-zinc-700">
			{/* Item Icon Skeleton */}
			<div className="flex items-center justify-center rounded-md h-full border-2 border-secondary/30 p-2 bg-secondary/5">
				<Skeleton className="h-full aspect-square w-8" />
			</div>
			<div className="flex flex-col flex-1 w-full h-full gap-2">
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<Skeleton className="h-4 w-[120px]" />
					<Skeleton className="h-4 w-4 rounded-full" />
				</div>
				<div className="min-w-fit flex flex-1 flex-row items-center gap-3">
					<Skeleton className="h-3 w-[40px]" />
					<Skeleton className="h-3 w-[40px]" />
				</div>
			</div>
		</Card>
	);
};

export { ItemCardComponent as ItemCard, ItemCardSkeleton };
