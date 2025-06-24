import { Calculator, ClipboardCheck, Crosshair, Diff, Route, TrendingUpDown } from "lucide-react";

export const tools = [
	{
		name: "Item Checklists",
		description: "Checklists for all uses for items in quests, workshop, and pinned recipes.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/item-checklists",
		icon: ClipboardCheck,
		iconColor: "text-arc-green-600 dark:text-arc-green-400",
	},
	{
		name: "Recycling Calculator",
		description: "Tree views for item's recycling tree, valuation calculator for items.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/recycling-calculator",
		icon: Calculator,
		iconColor: "text-arc-green-600 dark:text-arc-green-400",
	},
	{
		name: "Weapon Comparisons",
		description: "Compare different weapons, including TTK, DPS, and more.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/weapon-comparisons",
		icon: Diff,
		iconColor: "text-red-600 dark:text-red-400",
	},
	{
		name: "Weapon Modding",
		description:
			"Calculate the stat changes when modding weapons, including TTK, DPS, and more.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/weapon-modding",
		icon: Crosshair,
		iconColor: "text-red-600 dark:text-red-400",
	},
	{
		name: "Route Planner",
		description: "Plan routes for checklist items, quests, and high value items.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/route-planner",
		icon: Route,
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		name: "Meta Analysis",
		description:
			"View community based meta items, meta shifts from patches, and use cases for items.",
		image: "/images/quests/348px-Maps_Together.png-1.webp",
		link: "/tools/meta-analysis",
		icon: TrendingUpDown,
		iconColor: "text-purple-600 dark:text-purple-400",
	},
];
