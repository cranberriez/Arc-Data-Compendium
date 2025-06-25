import {
	ThemeProvider,
	RecipeProvider,
	ItemProvider,
	CookieProvider,
	WorkshopProvider,
	DialogProvider,
	QuestProvider,
} from "@/contexts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchRecipes, fetchItems, fetchQuests } from "@/services/dataService.server";

interface AppProvidersProps {
	children: React.ReactNode;
}

export async function AppProviders({ children }: AppProvidersProps) {
	const initialRecipes = await fetchRecipes();
	const initialItems = await fetchItems();
	const initialQuests = await fetchQuests();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
		>
			<SidebarProvider>
				<QuestProvider initialQuests={initialQuests}>
					<RecipeProvider initialRecipes={initialRecipes}>
						<ItemProvider initialItems={initialItems}>
							<CookieProvider>
								<WorkshopProvider>
									<DialogProvider>{children}</DialogProvider>
								</WorkshopProvider>
							</CookieProvider>
						</ItemProvider>
					</RecipeProvider>
				</QuestProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
