"use client";

import { ThemeProvider } from "@/contexts/themeContext";
import { ItemProvider } from "@/contexts/itemContext";
import { DialogProvider } from "@/contexts/dialogContext";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppProvidersProps {
	children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
		>
			<SidebarProvider>
				<ItemProvider>
					<DialogProvider>{children}</DialogProvider>
				</ItemProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
