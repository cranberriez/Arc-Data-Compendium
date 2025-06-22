// Helper types for generating workbench summary
export type WorkbenchUpgradeSummaryItem = {
	workbenchId: string;
	targetTier: number;
};

export interface WorkbenchUpgradeSummary {
	count: number;
	usedIn: Array<WorkbenchUpgradeSummaryItem>;
}
