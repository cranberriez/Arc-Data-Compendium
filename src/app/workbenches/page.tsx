"use client";

import { WorkbenchDisplay } from "@/components/workbench/workbenchDisplay";
import { workbenches } from "@/data/workbenches/workbenchHandler";
import { useItems } from "@/contexts/itemContext";

function WorkbenchList() {
	const { getItemById } = useItems();

	return (
		<main className="flex flex-col gap-x-6 gap-y-8 min-h-full w-full py-8 px-4 max-w-[1600px] mx-auto">
			{workbenches.map((workbench) => (
				<WorkbenchDisplay
					key={workbench.id}
					workbench={workbench}
					getItemById={getItemById}
				/>
			))}
		</main>
	);
}

function WorkbenchesPage() {
	return <WorkbenchList />;
}

export default WorkbenchesPage;
