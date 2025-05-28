import { Workbench } from "@/types/index";
import { WorkbenchTierContainer } from "./_components/wbTierCard";

export default function WorkbenchesPage({ workbench }: { workbench: Workbench }) {
	return <WorkbenchTierContainer workbench={workbench} />;
}
