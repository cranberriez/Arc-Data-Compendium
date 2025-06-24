import { Calculator, ClipboardCheck, Crosshair, Diff, Route, TrendingUpDown } from "lucide-react";

export const tools = [
	{
		name: "Item Checklists",
		description: "Checklists for all items in the game",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/item-checklists",
		icon: ClipboardCheck,
		iconColor: "text-arc-green-600 dark:text-arc-green-400",
	},
	{
		name: "Recycling Calculator",
		description: "Calculate the value of recycling items",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/recycling-calculator",
		icon: Calculator,
		iconColor: "text-arc-green-600 dark:text-arc-green-400",
	},
	{
		name: "Weapon Comparisons",
		description: "Compare different weapons",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/weapon-comparisons",
		icon: Diff,
		iconColor: "text-red-600 dark:text-red-400",
	},
	{
		name: "Weapon Modding",
		description: "Calculate the value of modding weapons",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/weapon-modding",
		icon: Crosshair,
		iconColor: "text-red-600 dark:text-red-400",
	},
	{
		name: "Route Planner",
		description: "Plan routes for hideout upgrades",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/route-planner",
		icon: Route,
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		name: "Meta Analysis",
		description: "Compare different meta items",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/meta-analysis",
		icon: TrendingUpDown,
		iconColor: "text-purple-600 dark:text-purple-400",
	},
];
