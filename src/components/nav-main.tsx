"use client";

import { type LucideIcon, ChevronDown, ChevronRight } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
	title: string;
	url?: string;
	icon?: LucideIcon | React.ComponentType<{ className?: string }>;
	isActive?: boolean;
	enabled?: boolean;
	items?: Omit<NavItem, "items">[];
};

function NavItem({ item, pathname }: { item: NavItem; pathname: string | null }) {
	const [isOpen, setIsOpen] = useState(false);
	const hasItems = item.items && item.items.length > 0;
	const isActive = pathname ? pathname === item.url : false;
	const isDisabled = !item.enabled;

	const activeButton = "bg-background hover:bg-background focus:outline-none";
	const disabledButton = "text-neutral-500 dark:text-neutral-500/80 cursor-not-allowed";
	const activeClass = isActive ? "text-primary" : "";

	if (hasItems) {
		return (
			<div className="space-y-1">
				<SidebarMenuItem>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={cn(
							"flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isDisabled ? disabledButton : "",
							"justify-between"
						)}
						disabled={isDisabled}
					>
						<div className="flex items-center gap-2">
							{item.icon && <item.icon className="h-4 w-4" />}
							<span className="text-base">{item.title}</span>
						</div>
						{isOpen ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>
				</SidebarMenuItem>
				{isOpen && item.items && (
					<div className="ml-4 mt-1 space-y-1">
						{item.items.map((subItem) => (
							<NavItem
								key={subItem.title}
								item={subItem}
								pathname={pathname}
							/>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				tooltip={item.title}
				className={cn(
					"flex flex-row items-center gap-2 h-auto",
					isActive ? activeButton : "",
					isDisabled ? disabledButton : ""
				)}
				disabled={isDisabled}
			>
				<Link
					href={isDisabled ? "#" : item.url || "#"}
					className={cn("w-full", activeClass)}
				>
					{item.icon && <item.icon className="h-4 w-4" />}
					<span className="text-base">{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export function NavMain({ items, category }: { items: NavItem[]; category: string }) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{category}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<NavItem
						key={item.title}
						item={item}
						pathname={pathname}
					/>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
