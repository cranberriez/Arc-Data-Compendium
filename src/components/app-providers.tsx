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
				<RecipeProvider initialRecipes={initialRecipes}>
					<ItemProvider initialItems={initialItems}>
						<CookieProvider>
							<QuestProvider initialQuests={initialQuests}>
								<WorkshopProvider>
									<DialogProvider>{children}</DialogProvider>
								</WorkshopProvider>
							</QuestProvider>
						</CookieProvider>
					</ItemProvider>
				</RecipeProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
