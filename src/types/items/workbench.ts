import { BaseItem } from "../items/base";

export interface WorkbenchTier {
	tier: number;
	requiredItems: Array<{ itemId: string; count: number }>;
	raidsRequired?: number;
}

export interface Workbench extends BaseItem {
	type: "workbench";
	baseTier: number;
	tiers: WorkbenchTier[];
}
