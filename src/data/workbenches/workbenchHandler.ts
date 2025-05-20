import { Workbench } from "@/types/items/workbench";
import { workbenchesData } from "./workbenchData";

// processWorkbenches
const processedWorkbenches = workbenchesData.map((workbench: Workbench) => ({
	...workbench,
}));

export const workbenches: Workbench[] = processedWorkbenches;
