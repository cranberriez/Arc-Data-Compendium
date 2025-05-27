export interface RecipeRequirement {
	itemId: string;
	count: number;
}

export interface RecipeWB {
	workbench:
		| "none"
		| "scrappy"
		| "weapon_bench"
		| "equipment_bench"
		| "med_station"
		| "explosives_bench"
		| "utility_bench"
		| "refiner";
	tier: number;
}

export interface RecipeLock {
	looted?: boolean;
	quest?: string;
	mastery?: string;
	event?: string;
	unsure?: boolean;
}

export interface Recipe {
	id: string;
	outputItemId: string;
	requirements: RecipeRequirement[];
	workbench: RecipeWB[] | null;
	craftTime: number;
	inRaid: boolean;
	outputCount: number;
	recipeLocked: boolean;
	lockedType?: RecipeLock;
}
