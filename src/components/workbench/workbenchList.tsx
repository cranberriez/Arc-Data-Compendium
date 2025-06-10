import { Workbench } from "@/types";
import { WorkbenchPreview } from "./workbenchPreview";

export const WorkbenchList = ({ workbenches }: { workbenches: Workbench[] }) => {
	return (
		<div className="flex-1 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,448px),1fr))]">
			{workbenches.map((workbench) => (
				<WorkbenchPreview
					key={workbench.id}
					workbench={workbench}
				/>
			))}
		</div>
	);
};
