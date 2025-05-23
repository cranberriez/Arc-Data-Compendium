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
					const activeButton = "bg-background hover:bg-background focus:outline-none";
					const disabledButton =
						"text-neutral-500 dark:text-neutral-500/80 cursor-not-allowed";

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={[
									"flex flex-row items-center gap-2 h-auto",
									isActive ? activeButton : "",
									isDisabled ? disabledButton : "",
								].join(" ")}
								disabled={isDisabled}
							>
								<Link
									href={isDisabled ? "#" : item.url}
									className={isActive ? "text-primary" : ""}
								>
									{item.icon && <item.icon />}
									<span className="text-base">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
