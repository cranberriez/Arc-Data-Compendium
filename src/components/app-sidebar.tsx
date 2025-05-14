"use client";

import * as React from "react";
import {
	Package,
	Hammer,
	Recycle,
	Shield,
	Swords,
	FlaskConical,
	Users,
	Map,
	Coins,
	BookMarked,
	Search,
	FileQuestion,
	CalendarClock,
	Zap,
	BadgeCent,
	LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-settings";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
	Home: {
		category: "Home",
		items: [
			{
				title: "Dashboard",
				url: "/",
				icon: LayoutDashboard,
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
			},
			{
				title: "Valuables",
				url: "/valuables",
				icon: Coins,
			},
			{
				title: "Recyclables",
				url: "/recycling",
				icon: Recycle,
			},
		],
	},

	Crafting: {
		category: "Crafting",
		items: [
			{
				title: "Workbench Recipes",
				url: "/crafting",
				icon: Hammer,
			},
			{
				title: "Workbench Info",
				url: "/workbenches",
				icon: FlaskConical,
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
			},
			{
				title: "Armor",
				url: "/gear",
				icon: Shield,
			},
			{
				title: "Quick Use",
				url: "/quickuse",
				icon: Zap,
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
			},
			{
				title: "Store",
				url: "/store",
				icon: BadgeCent,
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
			},
			{
				title: "Events",
				url: "/events",
				icon: CalendarClock,
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
		<Sidebar collapsible="icon" {...props} variant="inset">
			<SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
			<SidebarContent>
				{Object.values(data).map((category) => (
					<NavMain key={category.category} items={category.items} category={category.category} />
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
