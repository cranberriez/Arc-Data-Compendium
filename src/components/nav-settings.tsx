"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSettings() {
	const { theme, setTheme } = useTheme();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						variant="outline"
						size="default"
						className="w-full flex items-center justify-start gap-2 text-left"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
						<span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
