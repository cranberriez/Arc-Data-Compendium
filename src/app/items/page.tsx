"use client";

import { BadgeCheck, Hammer, Heart, Info, MapPin, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Type definitions
type SourceType = "drop" | "buy" | "craft" | "quest";

interface Source {
	type: SourceType;
	location: string;
	count?: number;
	value?: number;
}

interface Item {
	id: string;
	display_name: string;
	type: string;
	rarity: string;
	craftable: boolean;
	recipe?: string;
	sources: Source[];
	value: number;
}

// Helper function to get rarity color
const getRarityColor = (rarity: string) => {
	switch (rarity.toLowerCase()) {
		case "common":
			return "slate-500";
		case "uncommon":
			return "emerald-500";
		case "rare":
			return "blue-500";
		case "epic":
			return "purple-500";
		case "legendary":
			return "amber-500";
		default:
			return "slate-500";
	}
};

// Helper function to get rarity border
const getRarityBorder = (rarity: string) => {
	switch (rarity.toLowerCase()) {
		case "common":
			return "border-x-slate-500";
		case "uncommon":
			return "border-x-emerald-500";
		case "rare":
			return "border-x-blue-500";
		case "epic":
			return "border-x-purple-500";
		case "legendary":
			return "border-x-amber-500";
		default:
			return "border-x-slate-500";
	}
};

// Helper function to get type icon
const getTypeIcon = (type: string) => {
	switch (type.toLowerCase()) {
		case "quick_use":
			return <Zap className="h-4 w-4" />;
		case "weapon":
			return <Zap className="h-4 w-4" />;
		case "armor":
			return <BadgeCheck className="h-4 w-4" />;
		case "consumable":
			return <Heart className="h-4 w-4" />;
		case "material":
			return <Hammer className="h-4 w-4" />;
		default:
			return <Info className="h-4 w-4" />;
	}
};

// Helper function to get source icon
const getSourceIcon = (type: SourceType) => {
	switch (type) {
		case "drop":
			return <Sparkles className="h-4 w-4" />;
		case "buy":
			return <ShoppingCart className="h-4 w-4" />;
		case "craft":
			return <Hammer className="h-4 w-4" />;
		case "quest":
			return <MapPin className="h-4 w-4" />;
		default:
			return <Info className="h-4 w-4" />;
	}
};

type ItemCardProps = { item: Item; variant?: "default" | "slim" };

function ItemCard({ item, variant = "default" }: ItemCardProps) {
	// For demo purposes, we'll use the provided example
	const healingStim: Item = {
		id: "healing_stim",
		display_name: "Healing Stim",
		type: "quick_use",
		rarity: "uncommon",
		craftable: true,
		recipe: "healing_stim_recipe",
		sources: [
			{
				type: "drop",
				location: "Outpost Ambushers",
			},
			{
				type: "buy",
				location: "Med Vendor",
				count: 1,
				value: 45,
			},
		],
		value: 20,
	};

	// Use the provided item or fallback to the example
	const displayItem = item || healingStim;
	const rarityColor = getRarityColor(displayItem.rarity);
	const rarityBorder = getRarityBorder(displayItem.rarity);

	return (
		<Card
			className={`flex flex-row items-center gap-3 p-2 rounded-lg  ${
				variant === "slim" ? "w-min min-h-[72px] h-[112px]" : "w-full max-w-md min-h-[72px]"
			} bg-transparent border-zinc-700 shadow-md`}
		>
			{/* Item Icon */}
			<div className="flex items-center justify-center rounded-lg h-24 w-24 aspect-square bg-zinc-800">
				{getTypeIcon(displayItem.type)}
			</div>
			{/* Bubbles */}
			<div className="flex flex-col gap-1">
				{/* Bubble 1 */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center rounded-full h-7 w-7 bg-cyan-400 hover:scale-105 transition">
								<Sparkles className="h-4 w-4 text-cyan-900" />
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">
							<span>Dropped by enemies</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				{/* Bubble 2 */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center rounded-full h-7 w-7 bg-amber-300 hover:scale-105 transition">
								<ShoppingCart className="h-4 w-4 text-amber-900" />
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">
							<span>Available for purchase</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				{/* Bubble 3 */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center rounded-full h-7 w-7 bg-emerald-400 hover:scale-105 transition">
								<Hammer className="h-4 w-4 text-emerald-900" />
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">
							<span>Craftable item</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			{/* Item Name */}
			{variant !== "slim" && (
				<div className="flex-1">
					<span className="block text-2xl text-wrap text-white">
						{displayItem.display_name}
					</span>
				</div>
			)}
		</Card>
	);
}

function ItemPage() {
	const item: Item = {
		id: "healing_stim",
		display_name: "Healing Stim",
		type: "quick_use",
		rarity: "uncommon",
		craftable: true,
		recipe: "healing_stim_recipe",
		sources: [
			{
				type: "drop",
				location: "Outpost Ambushers",
			},
			{
				type: "buy",
				location: "Med Vendor",
				count: 1,
				value: 45,
			},
		],
		value: 20,
	};

	return (
		<main className="grid grid-cols-3 gap-x-6 gap-y-8 min-h-screen w-full items-center justify-center py-8">
			<ItemCard item={item} variant="slim" />
			<ItemCard item={item} />
		</main>
	);
}

export default ItemPage;
