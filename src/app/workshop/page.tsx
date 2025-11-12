import { WorkbenchList } from "../../components/workbench/workbenchList";
import ResetUserData from "../../components/workbench/resetUserData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Workshop | ARC Vault",
	description:
		"Workshop page listing all workbenches with recipes, requirements, item counters, and a checklist of all items required for upgrades.",
};

export default async function WorkshopOverview() {
	return (
		<main className="mx-auto max-w-[1600px]">
			<h1 className="text-2xl font-bold text-center mb-6">Workshop Overview</h1>
			<div className="flex flex-col-reverse xl:grid xl:grid-cols-[1fr_auto] gap-6 items-stretch">
				<WorkbenchList />
				{/* <WorkshopItemChecklist /> */}
			</div>
			<div className="flex my-8">
				<ResetUserData />
			</div>
		</main>
	);
}
