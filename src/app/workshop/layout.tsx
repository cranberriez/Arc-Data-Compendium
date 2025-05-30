import { WorkshopProvider } from "@/contexts/workshopContext";
import { RecipeProvider } from "@/contexts/recipeContext";

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full">
			<WorkshopProvider>
				<RecipeProvider>
					<main className="flex-1 sm:p-6">{children}</main>
				</RecipeProvider>
			</WorkshopProvider>
		</div>
	);
}
