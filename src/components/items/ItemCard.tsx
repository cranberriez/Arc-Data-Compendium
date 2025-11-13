"use client";

import * as React from "react";
import { useCallback } from "react";
import { Item } from "@/types";
import { useDialog } from "@/hooks/useUI";
import { IconVariant, CompactVariant, DetailedVariant, DefaultVariant } from "./variants";

export interface ItemCardProps {
	/** The item data to display */
	item: Item | undefined;
	/** Visual variant of the card */
	variant?: "default" | "icon" | "compact" | "detailed";
	/** Size of the card */
	size?: "sm" | "md" | "lg" | "xl";
	/** Orientation of the layout */
	orientation?: "horizontal" | "vertical";
	/** Item count to display */
	count?: number | string | undefined;
	/** Item count to display inside the card */
	innerCount?: boolean;
	/** Click handler */
	onClick?: () => void;
	/** Additional class names */
	className?: string;
	/** Performance metrics callback */
	onRenderComplete?: () => void;
	/** Whether to show the border */
	showBorder?: boolean;
}

/**
 * ItemCard is the main component for displaying items in various formats.
 * It supports different variants, sizes, and orientations to fit various UI needs.
 */
export const ItemCard = React.memo(
	function ItemCard({
		item,
		variant = "default",
		size = "md",
		orientation = "vertical",
		count,
		innerCount,
		onClick,
		className,
		onRenderComplete,
		showBorder = true,
	}: ItemCardProps) {
		const { openDialog } = useDialog();

		// Track render performance if callback provided
		React.useEffect(() => {
			onRenderComplete?.();
		}, [onRenderComplete]);

		// Default click handler to open the item dialog
		const handleClick = useCallback(() => {
			if (!item) return;

			if (onClick) {
				onClick();
			} else {
				openDialog("item", item);
			}
		}, [item, onClick, openDialog]);

		// Early return if no item
		if (!item) return null;

		const countString = count !== undefined ? count.toString() : undefined;

		// Render the appropriate variant
		switch (variant) {
			case "icon":
				return (
					<IconVariant
						item={item}
						size={size}
						count={countString}
						onClick={handleClick}
						className={className + " group/itemcard"}
						showBorder={showBorder}
						orientation={orientation}
					/>
				);
			case "compact":
				return (
					<CompactVariant
						item={item}
						size={size}
						count={countString}
						innerCount={innerCount}
						onClick={handleClick}
						showBorder={showBorder}
						orientation={orientation}
						className={className + " group/itemcard"}
					/>
				);
			case "detailed":
				return (
					<DetailedVariant
						item={item}
						size={size}
						orientation={orientation}
						count={countString}
						onClick={handleClick}
						className={className + " group/itemcard"}
					/>
				);
			default:
				return (
					<DefaultVariant
						item={item}
						size={size}
						count={countString}
						onClick={handleClick}
						className={className + " group/itemcard"}
					/>
				);
		}
	},
	(prevProps, nextProps) => {
		// Memoization comparison for performance optimization
		return (
			prevProps.item?.id === nextProps.item?.id &&
			prevProps.variant === nextProps.variant &&
			prevProps.size === nextProps.size &&
			prevProps.orientation === nextProps.orientation &&
			prevProps.count === nextProps.count &&
			prevProps.className === nextProps.className
		);
	}
);

export default ItemCard;
