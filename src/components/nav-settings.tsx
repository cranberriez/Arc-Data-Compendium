"use client";

import React from "react";
import { Moon, Sun, Scale } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSettings({ pages }: { pages: any }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Other</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						variant="outline"
						size="default"
						className="w-full flex items-center justify-start gap-2 text-left cursor-pointer"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{mounted ? (
							theme === "light" ? (
								<Moon className="h-5 w-5" />
							) : (
								<Sun className="h-5 w-5" />
							)
						) : (
							<Sun className="h-5 w-5" />
						)}
						<span>
							{mounted
								? theme === "light"
									? "Dark Mode"
									: "Light Mode"
								: "Light Mode"}
						</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton
						variant="default"
						size="default"
						className="w-full flex items-center justify-start gap-2 text-left cursor-pointer"
						asChild
					>
						<Link href={pages.Legal.items[0].url}>
							<Scale />
							<span>Legal</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
