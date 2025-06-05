import { fetchWorkbenches } from "@/services/dataService";
import ItemChecklist from "@/components/checklist/overview";
import { WorkbenchList } from "./components/workbenchList";
import ResetUserData from "./components/resetUserData";

export default async function WorkshopOverview() {
	const workbenches = await fetchWorkbenches();

	return (
		<main className="w-full py-8 px-4">
			<div className="mx-auto max-w-[1600px]">
				<h1 className="text-2xl font-bold text-center mb-6">Workshop Overview</h1>
				<div className="flex gap-6">
					<WorkbenchList workbenches={workbenches} />
					<ItemChecklist />
				</div>
				<div className="flex my-8">
					<ResetUserData />
				</div>
			</div>
		</main>
	);
}
