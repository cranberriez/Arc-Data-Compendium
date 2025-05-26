import { fetchWorkbenches } from "@/services/dataService";
import { Workbench } from "@/types/index";
import { WorkbenchClient } from "@/app/workbenches/_components/wbClient";

export default async function WorkbenchesPage() {
	const workbenches: Workbench[] = await fetchWorkbenches();

	return <WorkbenchClient workbenches={workbenches} />;
}
