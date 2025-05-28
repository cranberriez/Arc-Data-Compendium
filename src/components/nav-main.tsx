"use client";

import { type LucideIcon, ChevronDown } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
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
	const hasItems = item.items && item.items.length > 0;
	const isActive = pathname ? pathname === item.url : false;
	const isDisabled = !item.enabled;

	const activeButton = "bg-accent text-accent-foreground";
	const disabledButton = "text-muted-foreground/50 cursor-not-allowed";
	const activeClass = isActive ? "font-medium" : "";

	if (hasItems) {
		return (
			<Collapsible
				defaultOpen
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger
						className={cn(
							"flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
							isDisabled ? disabledButton : "",
							"justify-between [&[data-state=open]>svg]:rotate-180"
						)}
					>
						<div className="flex items-center gap-2">
							{item.icon && <item.icon className="h-4 w-4" />}
							<span className={cn("text-sm", activeClass)}>{item.title}</span>
						</div>
						<ChevronDown className="h-4 w-4 transition-transform duration-200" />
					</CollapsibleTrigger>
				</SidebarMenuItem>
				<CollapsibleContent>
					<div className="ml-6 mt-1 space-y-1">
						{item.items?.map((subItem) => (
							<NavItem
								key={subItem.title}
								item={subItem}
								pathname={pathname}
							/>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				className={cn(
					"flex flex-row items-center gap-2 h-auto",
					isActive ? activeButton : "",
					isDisabled ? disabledButton : "",
					"hover:bg-accent hover:text-accent-foreground"
				)}
				disabled={isDisabled}
			>
				<Link
					href={isDisabled ? "#" : item.url || "#"}
					className={cn("w-full py-2 px-2 text-sm", activeClass)}
				>
					{item.icon && <item.icon className="h-4 w-4" />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export function NavMain({ items, category }: { items: NavItem[]; category: string }) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
				{category}
			</SidebarGroupLabel>
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
