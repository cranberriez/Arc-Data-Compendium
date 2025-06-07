export interface RecipeRequirement {
	itemId: string;
	count: number;
}

export interface RecipeLock {
	looted?: boolean;
	mastery?: string;
	quest?: string;
	battlepass?: string;
	skill?: string;
	event?: string;
	unsure?: boolean;
}

export type WorkbenchId =
	| "none"
	| "scrappy"
	| "weapon_bench"
	| "equipment_bench"
	| "med_station"
	| "explosives_bench"
	| "utility_bench"
	| "refiner";

export interface Recipe {
	id: string;
	outputItemId: string;
	requirements: RecipeRequirement[];
	workbench: Partial<Record<WorkbenchId, number>> | null;
	craftTime: number;
	inRaid: boolean;
	outputCount: number;
	isLocked: boolean;
	lockedType?: RecipeLock;
}
