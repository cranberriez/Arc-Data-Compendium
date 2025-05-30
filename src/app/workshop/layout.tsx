import { WorkshopProvider } from "@/contexts/workshopContext";
import { RecipeProvider } from "@/contexts/recipeContext";

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
	return (
		<WorkshopProvider>
			<RecipeProvider>{children}</RecipeProvider>
		</WorkshopProvider>
	);
}
