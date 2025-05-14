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
		items?: {
			title: string;
			url: string;
		}[];
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
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={isActive ? "bg-red-300 dark:bg-red-800" : undefined}
							>
								<Link
									href={item.url}
									className={isActive ? "font-semibold text-primary" : undefined}
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
