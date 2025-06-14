import { BaseItem } from "../items/base";

export interface WorkbenchTier {
	tier: number;
	tierName?: string;
	requiredItems: Array<{ itemId: string; count: number }>;
	raidsRequired?: number;
}

export interface Workbench extends BaseItem {
	type: "workbench";
	baseTier: number;
	tiers: WorkbenchTier[];
}

export type WorkbenchUpgradeSummaryItem = {
	workbenchId: string;
	targetTier: number;
};

export interface WorkbenchUpgradeSummary {
	count: number;
	usedIn: Array<WorkbenchUpgradeSummaryItem>;
}
