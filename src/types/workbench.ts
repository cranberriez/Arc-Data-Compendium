import { BaseItem } from "./base";

export interface WorkbenchTier {
	tier: number;
	tierName?: string;
	requiredItems: Array<{ itemId: string; count: number }>;
	raidsRequired?: number;
}

export interface Workbench extends BaseItem {
	type: string;
	baseTier: number;
	tiers: WorkbenchTier[];
}
