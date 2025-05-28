import { Workbench } from "@/types/index";
import { WorkbenchTierContainer } from "@/app/workbenches/_components/wbTierCard";

export default function WorkbenchesPage({ workbench }: { workbench: Workbench }) {
	return <WorkbenchTierContainer workbench={workbench} />;
}
