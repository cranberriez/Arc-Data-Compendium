"use client";

import {
	ThemeProvider,
	RecipeProvider,
	ItemProvider,
	CookieProvider,
	WorkshopProvider,
	DialogProvider,
} from "@/contexts";
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
				<RecipeProvider>
					<ItemProvider>
						<CookieProvider>
							<WorkshopProvider>
								<DialogProvider>{children}</DialogProvider>
							</WorkshopProvider>
						</CookieProvider>
					</ItemProvider>
				</RecipeProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
