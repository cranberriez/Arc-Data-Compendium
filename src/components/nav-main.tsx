"use client";

import { type LucideIcon, ChevronDown } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";

export type NavItem = {
	title: string;
	url?: string;
	icon?: LucideIcon | React.ComponentType<{ className?: string }>;
	isActive?: boolean;
	enabled?: boolean;
	items?: Omit<NavItem, "items">[];
};

function NavItem({ item, pathname }: { item: NavItem; pathname: string | null }) {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	const hasItems = item.items && item.items.length > 0;
	const isActive = pathname ? pathname === item.url : false;
	const isDisabled = !item.enabled;

	const activeButton = "bg-accent text-accent-foreground";
	const disabledButton = "text-muted-foreground/50 cursor-not-allowed";
	const activeClass = isActive ? "font-medium" : "";

	// If sidebar is collapsed and item has no icon, don't render it
	if (isCollapsed && !item.icon) {
		return null;
	}

	if (hasItems && !isCollapsed) {
		return (
			<Collapsible
				defaultOpen={false}
				className="group/collapsible z-10"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger
						className={cn(
							"flex w-full h-full items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
							isDisabled ? disabledButton : "",
							"justify-between [&[data-state=open]>svg]:rotate-180",
							isCollapsed && "justify-start cursor-pointer"
						)}
					>
						<div className="flex items-center gap-2">
							{item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
							{!isCollapsed && (
								<span className={cn("text-sm truncate", activeClass)}>
									{item.title}
								</span>
							)}
						</div>
						{!isCollapsed && (
							<ChevronDown className="h-4 w-4 transition-transform duration-200" />
						)}
					</CollapsibleTrigger>
				</SidebarMenuItem>
				{!isCollapsed && (
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
				)}
			</Collapsible>
		);
	} else if (hasItems && isCollapsed) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<NavMainItem
						item={item}
						isActive={isActive}
						isDisabled={isDisabled}
						activeButton={activeButton}
						disabledButton={disabledButton}
						activeClass={activeClass}
						isCollapsed={isCollapsed}
					/>
				</PopoverTrigger>
				<PopoverContent
					side="right"
					sideOffset={32}
					className="w-fit p-1 border-1"
				>
					<div className="flex flex-col gap-2">
						{item.items?.map((subItem) => (
							<Link
								key={subItem.title}
								href={subItem.url || "#"}
								className={cn(
									"flex items-center py-2 px-2 text-xs gap-2 hover:bg-accent hover:text-accent-foreground rounded",
									subItem.url === pathname
										? "bg-accent text-accent-foreground"
										: ""
								)}
							>
								{subItem.icon && <subItem.icon className="h-4 w-4 flex-shrink-0" />}
								<p>{subItem.title}</p>
							</Link>
						))}
					</div>
				</PopoverContent>
			</Popover>
		);
	} else {
		return (
			<NavMainItem
				item={item}
				isActive={isActive}
				isDisabled={isDisabled}
				activeButton={activeButton}
				disabledButton={disabledButton}
				activeClass={activeClass}
				isCollapsed={isCollapsed}
			/>
		);
	}
}

type NavMainItemProps = {
	item: NavItem;
	isActive: boolean;
	isDisabled: boolean;
	activeButton: string;
	disabledButton: string;
	activeClass: string;
	isCollapsed: boolean;
};

// Use forwardRef so PopoverTrigger can attach to the correct DOM node
export const NavMainItem = React.forwardRef<HTMLAnchorElement, NavMainItemProps>(
	(
		{
			item,
			isActive,
			isDisabled,
			activeButton,
			disabledButton,
			activeClass,
			isCollapsed,
			...props
		},
		ref
	) => (
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
				{/* Link is the actual focusable element, so forward the ref here */}
				<Link
					ref={ref}
					href={isDisabled ? "#" : item.url || "#"}
					className={cn("w-full py-2 px-2 text-sm flex items-center gap-2", activeClass)}
					tabIndex={isDisabled ? -1 : 0}
					aria-disabled={isDisabled}
					{...props}
				>
					{item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
					{!isCollapsed && <span className="truncate">{item.title}</span>}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
);

NavMainItem.displayName = "NavMainItem";

export function NavMain({
	items,
	category,
	index,
}: {
	items: NavItem[];
	category: string | null;
	index: number;
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup style={{ zIndex: 99 - index }}>
			{category && (
				<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
					{category}
				</SidebarGroupLabel>
			)}
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
