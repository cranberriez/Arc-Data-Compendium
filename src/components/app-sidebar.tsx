"use client";

import * as React from "react";
import {
	Package,
	Hammer,
	Recycle,
	Shield,
	Swords,
	FlaskConical,
	Map,
	Coins,
	BookMarked,
	CalendarClock,
	Zap,
	BadgeCent,
	LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-settings";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	Home: {
		category: "Home",
		items: [
			{
				title: "Dashboard",
				url: "/",
				icon: LayoutDashboard,
				enabled: true,
			},
		],
	},

	Items: {
		category: "Items",
		items: [
			{
				title: "All Items",
				url: "/items",
				icon: Package,
				enabled: true,
			},
			// ,
			// {
			// 	title: "Valuables",
			// 	url: "/valuables",
			// 	icon: Coins,
			// 	enabled: true,
			// },
			// {
			// 	title: "Recyclables",
			// 	url: "/recycling",
			// 	icon: Recycle,
			// 	enabled: true,
			// },
		],
	},

	Crafting: {
		category: "Crafting",
		items: [
			{
				title: "Workbenches",
				url: "/workbenches",
				icon: FlaskConical,
				enabled: true,
			},
			{
				title: "Workbench Recipes",
				url: "/crafting",
				icon: Hammer,
				enabled: false,
			},
		],
	},

	Gear: {
		category: "Gear",
		items: [
			{
				title: "Weapons",
				url: "/weapons",
				icon: Swords,
				enabled: false,
			},
			{
				title: "Armor",
				url: "/gear",
				icon: Shield,
				enabled: false,
			},
			{
				title: "Quick Use",
				url: "/quickuse",
				icon: Zap,
				enabled: false,
			},
		],
	},

	Speranza: {
		category: "Speranza",
		items: [
			{
				title: "Quests",
				url: "/quests",
				icon: BookMarked,
				enabled: false,
			},
			{
				title: "Store",
				url: "/store",
				icon: BadgeCent,
				enabled: false,
			},
		],
	},

	World: {
		category: "World",
		items: [
			{
				title: "Locations",
				url: "/locations",
				icon: Map,
				enabled: false,
			},
			{
				title: "Events",
				url: "/events",
				icon: CalendarClock,
				enabled: false,
			},
		],
	},

	// Tools: {
	// 	category: "Tools",
	// 	items: [
	// 		{
	// 			title: "Search",
	// 			url: "/search",
	// 			icon: Search,
	// 		},
	// 		{
	// 			title: "Unknown Data",
	// 			url: "/unknown",
	// 			icon: FileQuestion,
	// 		},
	// 	],
	// },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
			variant="inset"
		>
			<SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
			<SidebarContent>
				{Object.values(data).map((category) => (
					<NavMain
						key={category.category}
						items={category.items}
						category={category.category}
					/>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavSettings />
				{/* <NavUser user={data.user} /> */}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
