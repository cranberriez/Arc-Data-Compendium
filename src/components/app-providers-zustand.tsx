import { ThemeProvider } from "@/contexts/themeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreProvider } from "@/stores/StoreProvider";
import {
	fetchRecipes,
	fetchItems,
	fetchQuests,
	fetchWorkbenches,
} from "@/services/dataService.server";

import { ItemDialog } from "./dialog/itemDialog";

interface AppProvidersProps {
	children: React.ReactNode;
}

export async function AppProvidersZustand({ children }: AppProvidersProps) {
	// Fetch all data server-side for pre-rendering
	const [initialRecipes, initialItems, initialQuests, initialWorkbenches] = await Promise.all([
		fetchRecipes(),
		fetchItems(),
		fetchQuests(),
		fetchWorkbenches(),
	]);

	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<SidebarProvider>
				<StoreProvider
					initialData={{
						items: initialItems,
						recipes: initialRecipes,
						quests: initialQuests,
						workbenches: initialWorkbenches,
					}}
				>
					<ItemDialog />
					{children}
				</StoreProvider>
			</SidebarProvider>
		</ThemeProvider>
	);
}
