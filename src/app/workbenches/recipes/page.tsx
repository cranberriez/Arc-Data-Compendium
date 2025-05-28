import { fetchWorkbenches } from "@/services/dataService";
import { Workbench } from "@/types/index";
import { WorkbenchRecipesClient } from "@/app/workbenches/recipes/wbRecipesClient";

export default async function WorkbenchesRecipesPage() {
	const workbenches: Workbench[] = await fetchWorkbenches();

	return <WorkbenchRecipesClient workbenches={workbenches} />;
}
