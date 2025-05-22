export interface RecipeRequirement {
	itemId: string;
	count: number;
}

export interface Recipe {
	id: string;
	outputItemId: string;
	requirements: RecipeRequirement[];
	workbench:
		| "none"
		| "scrappy"
		| "weapon_bench"
		| "equipment_bench"
		| "med_station"
		| "explosives_bench"
		| "utility_bench"
		| "refiner";
	workbenchTier: number;
	craftTime: number;
	outputCount: number;
	unlockedByDefault: boolean;
}
