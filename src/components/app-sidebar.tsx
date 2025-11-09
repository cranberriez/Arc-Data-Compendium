"use client";

import * as React from "react";
import {
	Package,
	Hammer,
	Recycle,
	Shield,
	Swords,
	FlaskConical,
	Layers,
	Map,
	BookMarked,
	CalendarClock,
	Zap,
	BadgeCent,
	LayoutDashboard,
	Scale,
	Home,
	Shirt,
	Heart,
	Vault,
	Calculator,
	Bomb,
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
import { cn } from "@/lib/utils";

export interface NavItem {
	title: string;
	url?: string;
	icon: React.ComponentType<{ className?: string }>;
	enabled: boolean;
	items?: NavItem[]; // For nested items
}

// Category type
export interface NavCategory {
	category: string | null;
	items: NavItem[];
}

// Type for the entire navigation data structure
export type NavData = Record<string, NavCategory>;

const data: NavData = {
	Home: {
		category: null,
		items: [
			{
				title: "Home",
				url: "/",
				icon: Home,
				enabled: true,
			},
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
				enabled: false,
			},
			{
				title: "Tools",
				url: "/tools",
				icon: Calculator,
				enabled: false,
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
				url: "/workshop",
				icon: FlaskConical,
				enabled: true,
			},
			{
				title: "Workshop",
				icon: Hammer,
				enabled: true,
				items: [
					{
						title: "Scrappy",
						icon: Package,
						url: "/workshop/scrappy",
						enabled: true,
					},
					{
						title: "Workbench",
						icon: Hammer,
						url: "/workshop/workbench",
						enabled: true,
					},
					{
						title: "Gear Bench",
						icon: Shirt,
						url: "/workshop/gear_bench",
						enabled: true,
					},
					{
						title: "Gunsmith",
						icon: Swords,
						url: "/workshop/gunsmith",
						enabled: true,
					},
					{
						title: "Utility Station",
						icon: Layers,
						url: "/workshop/utility_station",
						enabled: true,
					},
					{
						title: "Medical Lab",
						icon: Heart,
						url: "/workshop/medical_lab",
						enabled: true,
					},
					{
						title: "Explosives Station",
						icon: Bomb,
						url: "/workshop/explosives_station",
						enabled: true,
					},
					{
						title: "Refiner",
						icon: Zap,
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
};

const settingsPages = {
	About: {
		category: "About",
		items: [
			{
				title: "About",
				url: "/about",
				icon: Scale,
				enabled: true,
			},
		],
	},
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props} variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="p-0">
						<SidebarMenuButton
							asChild
							className={cn(
								"[&>svg]:size-8 group/home p-0",
								usePathname() === "/" ? "" : ""
							)}
							size="lg"
						>
							<Link href="/" className="relative group h-fit transition-all">
								<div className="flex items-center justify-center gap-2 min-w-8 min-h-8 aspect-square transition-all duration-500 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 dark:from-teal-400 dark:to-yellow-200 bg-[length:200%_100%] bg-[position:0_0] group-hover/home:bg-[position:100%_100%]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-sidebar scale-150 transition-transform duration-500 group-hover/home:rotate-90"
										aria-hidden="true"
									>
										<circle
											cx="7.5"
											cy="7.5"
											r=".5"
											fill="currentColor"
										></circle>
										<path d="m7.9 7.9 2.7 2.7"></path>
										<circle
											cx="16.5"
											cy="7.5"
											r=".5"
											fill="currentColor"
										></circle>
										<path d="m13.4 10.6 2.7-2.7"></path>
										<circle
											cx="7.5"
											cy="16.5"
											r=".5"
											fill="currentColor"
										></circle>
										<path d="m7.9 16.1 2.7-2.7"></path>
										<circle
											cx="16.5"
											cy="16.5"
											r=".5"
											fill="currentColor"
										></circle>
										<path d="m13.4 13.4 2.7 2.7"></path>
										<circle cx="12" cy="12" r="2"></circle>
									</svg>
								</div>
								<span
									className={`text-xl tracking-wider transition-colors whitespace-nowrap mb-1 ${
										usePathname() === "/" ? "" : ""
									}`}
								>
									ARC VAULT
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{Object.values(data).map((category, index) => (
					<NavMain
						key={category.category}
						items={category.items}
						category={category.category}
						index={index}
					/>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavSettings pages={settingsPages} />
			</SidebarFooter>
		</Sidebar>
	);
}
