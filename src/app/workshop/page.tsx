import { fetchWorkbenches } from "@/services/dataService";
import ItemChecklist from "@/components/checklist/overview";
import { InfoIcon } from "lucide-react";
import { WorkbenchList } from "./components/workbenchPreview";
import ResetUserData from "./components/resetUserData";

export default async function WorkshopOverview() {
	const workbenches = await fetchWorkbenches();

	return (
		<main className="w-full py-8 px-4">
			<div className="mx-auto max-w-[1600px]">
				<h1 className="text-2xl font-bold text-center mb-6">Workshop Overview</h1>
				<div className="flex flex-col gap-6">
					<div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 p-2 rounded dark:text-amber-200 border-2 dark:border-amber-200 border-cyan-600 text-cyan-600">
						<InfoIcon
							size={24}
							className="text-lg min-w-8"
						/>
						<h3 className="text-lg">
							Workbench levels can be pinned in game to see a live counter of the # of
							items you need.
						</h3>
					</div>
					<ItemChecklist />
					<WorkbenchList workbenches={workbenches} />
				</div>
				<div className="flex my-8">
					<ResetUserData />
				</div>
			</div>
		</main>
	);
}
