import {
	ThemeProvider,
	RecipeProvider,
	ItemProvider,
	CookieProvider,
	WorkshopProvider,
	DialogProvider,
} from "@/contexts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchRecipes, fetchItems } from "@/services/dataService.server";

interface AppProvidersProps {
	children: React.ReactNode;
}

export async function AppProviders({ children }: AppProvidersProps) {
	const initialRecipes = await fetchRecipes();
	const initialItems = await fetchItems();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
		>
			<SidebarProvider defaultOpen={false}>
				<RecipeProvider initialRecipes={initialRecipes}>
					<ItemProvider initialItems={initialItems}>
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
