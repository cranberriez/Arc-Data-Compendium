"use client";

import { ThemeProvider } from "@/contexts/themeContext";
import { ItemProvider } from "@/contexts/itemContext";
import { DialogProvider } from "@/contexts/dialogContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkshopProvider } from "@/contexts/workshopContext";
import { RecipeProvider } from "@/contexts/recipeContext";

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
				<WorkshopProvider>
					<RecipeProvider>
						<ItemProvider>
							<DialogProvider>{children}</DialogProvider>
						</ItemProvider>
					</RecipeProvider>
				</WorkshopProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
