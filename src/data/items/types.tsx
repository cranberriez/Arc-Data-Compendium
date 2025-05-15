import {
	Cog,
	Hammer,
	Heart,
	Info,
	LucideIcon,
	MapPin,
	Shield,
	ShoppingCart,
	Sparkles,
	Sword,
	Wrench,
	Zap,
} from "lucide-react";

// Types for item classification
export type ItemType =
	| "quick_use"
	| "recyclable"
	| "crafting_material"
	| "valuable"
	| "weapon"
	| "gear"
	| "quest_item"
	| "consumable";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type SourceType = "drop" | "buy" | "quest" | "found" | "event" | "craft";

// Source information
export interface ItemSource {
	type: SourceType;
	location: string;
	count?: number; // For 'buy' or 'recycle' type
	value?: number; // Buy price, if applicable
	itemId?: string; // For reverse lookup of recycling sources
}

// Recycling structure
export interface Recycling {
	id: string; // ID of the resulting item item_id
	count: number;
}

// Main item interface
export interface Item {
	id: string;
	display_name: string;
	icon: LucideIcon | null;
	type: ItemType;
	rarity: Rarity;
	craftable: boolean;
	recipe: string | null; // Recipe ID if craftable
	sources: ItemSource[]; // Where/how the item is obtained
	value: number; // Sell value
	recycling?: Recycling[]; // Recycling information, if applicable
}

// Helper function to get rarity color
export const getRarityColor = (rarity: string) => {
	switch (rarity.toLowerCase()) {
		case "common":
			return "text-slate-500";
		case "uncommon":
			return "text-emerald-500";
		case "rare":
			return "text-blue-500";
		case "epic":
			return "text-purple-500";
		case "legendary":
			return "text-amber-500";
		default:
			return "text-slate-500";
	}
};

// Helper function to get rarity border
export const getRarityBorder = (rarity: string) => {
	switch (rarity.toLowerCase()) {
		case "common":
			return "border-slate-500";
		case "uncommon":
			return "border-emerald-500";
		case "rare":
			return "border-blue-500";
		case "epic":
			return "border-purple-500";
		case "legendary":
			return "border-amber-500";
		default:
			return "border-slate-500";
	}
};

// Helper function to get type icon
export const getTypeIcon = (
	type: string,
	props: React.ComponentProps<LucideIcon> = { size: 16 }
) => {
	const iconProps = { size: 16, ...props };
	const IconComponent = (() => {
		switch (type.toLowerCase()) {
			case "quick_use":
				return Zap;
			case "weapon":
				return Sword;
			case "armor":
				return Shield;
			case "consumable":
				return Heart;
			case "recyclable":
				return Wrench;
			case "crafting_material":
				return Cog;
			default:
				return Info;
		}
	})();

	return <IconComponent {...iconProps} />;
};

// Helper function to get source icon
export const getSourceIcon = (type: SourceType): LucideIcon => {
	switch (type) {
		case "drop":
			return Sparkles;
		case "buy":
			return ShoppingCart;
		case "craft":
			return Hammer;
		case "quest":
			return MapPin;
		default:
			return Info;
	}
};

// Helper function for converting underscore case to readable name
export const formatName = (type: string) => {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

// Fallback placeholder item for debug purposes
export const placeholderItem: Item = {
	id: "placeholder",
	display_name: "Placeholder",
	type: "crafting_material",
	icon: Info,
	rarity: "common",
	craftable: false,
	recipe: null,
	sources: [],
	value: 0,
};
