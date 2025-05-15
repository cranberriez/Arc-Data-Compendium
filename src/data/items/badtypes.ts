// import { LucideIcon } from "lucide-react";

// // Types for item classification
// export type ItemType =
// 	| "quick_use"
// 	| "recyclable"
// 	| "crafting_material"
// 	| "valuable"
// 	| "weapon"
// 	| "gear"
// 	| "quest_item"
// 	| "consumable";

// export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

// export type SourceType = "drop" | "buy" | "quest" | "found" | "event";

// // Source information
// export interface ItemSource {
// 	type: SourceType;
// 	location: string;
// 	count?: number; // For 'buy' type
// 	value?: number; // Buy price, if applicable
// }

// // Recycling output structure
// export interface RecycleOutput {
// 	id: string; // ID of the resulting item
// 	count: number;
// }

// // Recycling details
// export interface Recycling {
// 	outputs: RecycleOutput[]; // Items obtained from recycling
// 	required_tool?: string; // Optional: specific tool needed for recycling
// 	efficiency?: number; // Optional: efficiency percentage (e.g., 0.75 for 75%)
// }

// // Main item interface
// export interface Item {
// 	id: string;
// 	display_name: string;
// 	type: ItemType;
// 	rarity: Rarity;
// 	craftable: boolean;
// 	recipe: string | null; // Recipe ID if craftable
// 	sources: ItemSource[]; // Where/how the item is obtained
// 	value: number; // Sell value
// 	recycling: Recycling | null; // Recycling information, if applicable
// }

// export const getRarityColor = (rarity: string) => {
// 	switch (rarity.toLowerCase()) {
// 		case "common":
// 			return "text-slate-500";
// 		case "uncommon":
// 			return "text-emerald-500";
// 		case "rare":
// 			return "text-blue-500";
// 		case "epic":
// 			return "text-purple-500";
// 		case "legendary":
// 			return "text-amber-500";
// 		default:
// 			return "text-slate-500";
// 	}
// };

// export const getRarityBorder = (rarity: string) => {
// 	switch (rarity.toLowerCase()) {
// 		case "common":
// 			return "border-slate-500";
// 		case "uncommon":
// 			return "border-emerald-500";
// 		case "rare":
// 			return "border-blue-500";
// 		case "epic":
// 			return "border-purple-500";
// 		case "legendary":
// 			return "border-amber-500";
// 		default:
// 			return "border-slate-500";
// 	}
// };

// export const formatName = (type: string) => {
// 	return type
// 		.split("_")
// 		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// 		.join(" ");
// };

// // Placeholder icon and type helpers for generic items
// declare const BoxIcon: LucideIcon;
// export const getTypeIcon = (type: string) => BoxIcon;

// export const placeholderItem: Item = {
// 	id: "placeholder",
// 	display_name: "Placeholder Item",
// 	type: "crafting_material",
// 	rarity: "common",
// 	craftable: false,
// 	recipe: null,
// 	sources: [],
// 	value: 0,
// 	recycling: null,
// };
