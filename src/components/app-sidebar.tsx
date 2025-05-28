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
	Home,
	Vault,
	Scale,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-settings";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
	title: string;
	url?: string;
	icon: React.ComponentType<{ className?: string }>;
	enabled: boolean;
	items?: NavItem[]; // For nested items
}

// Category type
export interface NavCategory {
	category: string;
	items: NavItem[];
}

// Type for the entire navigation data structure
export type NavData = Record<string, NavCategory>;

const data: NavData = {
	Home: {
		category: "Home",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
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
		],
	},

	Workshop: {
		category: "Workshop",
		items: [
			{
				title: "Overview",
				url: "/workshop/overview",
				icon: FlaskConical,
				enabled: true,
			},
			{
				title: "Workbenches",
				icon: Hammer,
				enabled: true,
				items: [
					{
						title: "Scrappy",
						icon: FlaskConical,
						url: "/workshop/scrappy",
						enabled: true,
					},
					{
						title: "Basic Bench",
						icon: FlaskConical,
						url: "/workshop/basic",
						enabled: true,
					},
					{
						title: "Equipment Bench",
						icon: FlaskConical,
						url: "/workshop/equipment",
						enabled: true,
					},
					{
						title: "Weapon Bench",
						icon: FlaskConical,
						url: "/workshop/weapon",
						enabled: true,
					},
					{
						title: "Utility Bench",
						icon: FlaskConical,
						url: "/workshop/utility",
						enabled: true,
					},
					{
						title: "Med Station",
						icon: FlaskConical,
						url: "/workshop/med",
						enabled: true,
					},
					{
						title: "Refiner",
						icon: FlaskConical,
						url: "/workshop/refiner",
						enabled: true,
					},
				],
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

const settingsPages = {
	Legal: {
		category: "Legal",
		items: [
			{
				title: "Legal Information",
				url: "/legal",
				icon: Scale,
				enabled: true,
			},
		],
	},
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
			variant="inset"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="h-12 [&>svg]:size-8"
							size="lg"
							isActive={usePathname() === "/"}
						>
							<Link
								href="/"
								className="relative"
							>
								<Vault
									className={`text-blue-600 group-hover:text-blue-500 dark:text-blue-500 dark:group-hover:text-blue-400 transition-colors ${
										usePathname() === "/" ? "dark:text-blue-400" : ""
									}`}
								/>
								<span
									className={`text-xl font-semibold text-blue-600 group-hover:text-blue-500 dark:text-blue-500 dark:group-hover:text-blue-400 transition-colors ${
										usePathname() === "/" ? "dark:text-blue-400 font-bold" : ""
									}`}
								>
									ARC Vault
								</span>
								{usePathname() === "/" && (
									<span className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-blue-500" />
								)}
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{Object.values(data).map((category) => (
					<NavMain
						key={category.category}
						items={category.items}
						category={category.category}
					/>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavSettings pages={settingsPages} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
