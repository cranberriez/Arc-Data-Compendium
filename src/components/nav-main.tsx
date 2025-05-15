"use client";

import { type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { usePathname } from "next/navigation";

export function NavMain({
	items,
	category,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		enabled?: boolean;
	}[];
	category: string;
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{category}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isActive =
						// set active, or default to false if no pathnam (first load)
						// if no pathname then we set only the "/" item to active because its first load
						pathname === item.url ? true : pathname === "/" && item.url === "/";

					const isDisabled = !item.enabled;
					const activeButton =
						"bg-arc-copper hover:bg-arc-copper/90 hover:dark:bg-arc-copper/90 focus:bg-arc-copper focus:dark:bg-arc-copper focus:outline-none focus:ring-1 focus:ring-arc-copper focus:ring-offset-1";
					const disabledButton =
						"text-neutral-500 dark:text-neutral-500/80 cursor-not-allowed";

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={
									isActive ? activeButton : isDisabled ? disabledButton : ""
								}
								disabled={isDisabled}
							>
								<Link
									href={isDisabled ? "#" : item.url}
									className={isActive ? "font-semibold text-primary" : ""}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
