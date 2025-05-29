"use client";

import * as React from "react";
import { Item } from "@/types";

// Import new components
import { ItemCard as NewItemCard } from "./ItemCard";

// Legacy support type - maps to the new expanded ItemCardProps
type ItemCardProps = {
	item?: Item;
	variant?: "default" | "icon";
	count?: number;
	onClick?: () => void;
	className?: string;
	size?: "sm" | "md" | "lg" | "default";
	hideText?: boolean;
};

/**
 * ItemCardComponent (Legacy)
 * @deprecated Use ItemCard component instead with expanded features
 * This component is maintained for backward compatibility
 */
const ItemCardComponent = React.memo(
	function ItemCard({
		item,
		variant = "default",
		count = undefined,
		onClick,
		className,
		size = "default",
		hideText = false,
	}: ItemCardProps) {
		// Map old size values to new size system
		const newSize = React.useMemo(() => {
			switch (size) {
				case "sm":
					return "sm";
				case "md":
					return "md";
				case "lg":
					return "lg";
				case "default":
					return "md";
				default:
					return "md";
			}
		}, [size]);

		// Use the new ItemCard component with appropriate props mapping
		// Only render if item exists
		if (!item) return null;

		return (
			<NewItemCard
				item={item}
				variant={variant === "icon" ? "icon" : "default"}
				size={newSize}
				orientation="horizontal"
				count={count}
				onClick={onClick}
				className={className}
			/>
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

// Re-export the new ItemCard and its subcomponents
export { ItemImage } from "./ItemImage";
export { ItemContent } from "./ItemContent";
export { ItemHeader } from "./ItemHeader";
export { ItemDetails } from "./ItemDetails";
export { ItemBadges } from "./ItemBadges";

// Default export for new code
export { NewItemCard as default };

// Legacy export for backward compatibility
export { ItemCardComponent as ItemCard };
