"use client";

import { BadgeCheck, Hammer, Heart, Info, MapPin, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
	icon?: LucideIcon;
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
const getRarityBorder = (rarity: string) => {
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

// Helper function for converting underscore case to readable name
const formatName = (type: string) => {
	// "quick_use" -> "Quick Use"
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

type ItemCardProps = { item?: Item };

function ItemCard({ item }: ItemCardProps) {
	// For demo purposes, we'll use the provided example
	const healingStim: Item = {
		id: "healing_stim",
		display_name: "Healing Stim",
		type: "quick_use",
		icon: Heart,
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
			className={`flex flex-row items-center gap-2 p-1 pr-2 rounded-lg w-full h-full md:max-w-[300px] max-w-[400px] bg-transparent border-zinc-700`}
		>
			{/* Item Icon */}
			<div
				className={cn(
					"flex items-center justify-center rounded-sm h-full aspect-square bg-zinc-800 border-1",
					rarityBorder
				)}
			>
				{displayItem.icon && <displayItem.icon className={rarityColor} />}
			</div>
			<div className="flex flex-col flex-1 w-full h-full">
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div className="text-nowrap truncate max-w-[180px]">
						{displayItem.display_name}
					</div>
					{/* <div>{getTypeIcon(displayItem.type)}</div> */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>{getTypeIcon(displayItem.type)}</TooltipTrigger>
							<TooltipContent>
								<span>{formatName(displayItem.type)}</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<div>{displayItem.rarity}</div>
					{/* <div>{getTypeIcon(displayItem.type)}</div> */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>{getTypeIcon(displayItem.type)}</TooltipTrigger>
							<TooltipContent>
								<span>{formatName(displayItem.type)}</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</Card>
	);
}

function ItemPage() {
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-4">
			<ItemCard />
			{Array.from({ length: 100 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-center rounded-md border-2 border-dashed border-muted p-6 text-muted-foreground w-full h-full md:max-w-[300px] max-w-[400px]"
				>
					<span className="text-sm">Placeholder {i + 1}</span>
				</div>
			))}
		</main>
	);
}

export default ItemPage;
