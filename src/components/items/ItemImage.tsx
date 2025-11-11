"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { getRarityColor } from "@/utils/items/itemUtils";
import { getItemImagePath } from "@/utils/itemImage";
import getItemIcon from "./getItemIcon";

// This can be moved to environment variables if needed
const USE_ACTUAL_IMAGES = true;

export interface ItemImageProps {
	/** The item to display */
	item: Item;
	/** Size variant of the image */
	size?: "sm" | "md" | "lg" | "xl";
	/** Additional class names */
	className?: string;
	/** Container class names */
	containerClassName?: string;
	/** Whether to show a border around the image */
	showBorder?: boolean;
	/** Performance tracking callback */
	onLoadComplete?: () => void;
}

/**
 * ItemImage component handles displaying an item's image or fallback icon
 * with loading states, error handling, and responsive sizing.
 */
export const ItemImage = React.memo(function ItemImage({
	item,
	size = "md",
	className,
	containerClassName,
	showBorder = true,
	onLoadComplete,
}: ItemImageProps) {
	const [imageError, setImageError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Size mapping for the component
	const sizeClasses = {
		sm: "w-10 h-10",
		md: "w-12 h-12",
		lg: "w-16 h-16",
		xl: "w-20 h-20",
	};

	const imageSizes = {
		sm: "48px",
		md: "64px",
		lg: "96px",
		xl: "128px",
	};

	// Border color based on item rarity
	const borderClass = useMemo(
		() => (showBorder && item ? getRarityColor(item.rarity, "border") : undefined),
		[item, showBorder]
	);

	// Handle image load completion
	const handleImageLoad = React.useCallback(() => {
		setIsLoading(false);
		onLoadComplete?.();
	}, [onLoadComplete]);

	// Handle image load error
	const handleImageError = React.useCallback(() => {
		setImageError(true);
		setIsLoading(false);
		onLoadComplete?.();
	}, [onLoadComplete]);

	// Render image or fallback icon
	const imageContent = useMemo(() => {
		if (!item) return null;

		const imagePath = getItemImagePath(item.id);
		if (USE_ACTUAL_IMAGES && imagePath && !imageError) {
			return (
				<div className={cn("relative bg-muted/25", sizeClasses[size])}>
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center animate-pulse">
							<span className="sr-only">Loading image...</span>
						</div>
					)}
					<Image
						src={imagePath}
						alt={item.name}
						fill
						className={cn(
							"object-contain transition-opacity",
							isLoading ? "opacity-0" : "opacity-100"
						)}
						onLoad={handleImageLoad}
						onError={handleImageError}
						sizes={imageSizes[size]}
					/>
				</div>
			);
		}

		// Use the icon as fallback
		return getItemIcon(
			item.icon,
			cn(sizeClasses[size], getRarityColor(item.rarity, "text"), className)
		);
	}, [item, imageError, isLoading, size, className, handleImageLoad, handleImageError]);

	if (!item) return null;

	return (
		<div
			className={cn(
				"flex items-center justify-center aspect-square relative",
				showBorder && "border-2 rounded-sm p-[2px]",
				borderClass,
				containerClassName
			)}
			aria-label={`Image of ${item.name}`}
		>
			{imageContent}
		</div>
	);
});

export default ItemImage;
