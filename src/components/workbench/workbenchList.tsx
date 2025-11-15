"use client";

import { WorkbenchPreview } from "./workbenchPreview";
import { useWorkbenches } from "@/hooks/useData";

export const WorkbenchList = () => {
	const { workbenches } = useWorkbenches();

	return (
		<div className="flex-1 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,448px),1fr))]">
			{workbenches.map((workbench) => (
				<WorkbenchPreview key={workbench.id} workbench={workbench} />
			))}
		</div>
	);
};
