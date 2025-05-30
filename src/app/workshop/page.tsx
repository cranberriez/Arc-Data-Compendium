import { fetchWorkbenches } from "@/services/dataService";
import Link from "next/link";
import { WorkbenchOverview } from "./components/workbenchOverview";

export default async function WorkshopOverview() {
	const workbenches = await fetchWorkbenches();

	return (
		<main className="w-full py-8">
			<div className="mx-auto max-w-6xl">
				<h1 className="text-2xl font-bold text-center mb-6">Workshop Overview</h1>
				<div className="flex flex-col gap-6">
					{workbenches.map((workbench) => (
						<WorkbenchOverview
							key={workbench.id}
							workbench={workbench}
							currentTier={workbench.baseTier}
							link={`/workshop/${workbench.id}`}
						/>
					))}
				</div>
			</div>
		</main>
	);
}
