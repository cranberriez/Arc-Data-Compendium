"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ItemProvider } from "@/contexts/ItemContext";
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
