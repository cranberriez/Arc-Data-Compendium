"use client";

import { ThemeProvider } from "@/contexts/themeContext";
import { ItemProvider } from "@/contexts/itemContext";
import { ItemDialogProvider } from "@/components/items/item-dialog-context";
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
					<ItemDialogProvider>{children}</ItemDialogProvider>
				</ItemProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
