import { Item, Recipe, Quest, Workbench } from "@/types";
import { FilterOptions, SortOptions } from "@/utils/items/types";

// Core data store - read-only game data
export interface DataStore {
	// Data
	items: Item[];
	recipes: Recipe[];
	quests: Quest[];
	workbenches: Workbench[];

	// Loading states
	isLoading: boolean;
	error: string | null;

	// Actions
	setItems: (items: Item[]) => void;
	setRecipes: (recipes: Recipe[]) => void;
	setQuests: (quests: Quest[]) => void;
	setWorkbenches: (workbenches: Workbench[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Selectors
	getItemById: (id: string) => Item | undefined;
	getRecipeById: (id: string) => Recipe | undefined;
	getQuestById: (id: string) => Quest | undefined;
	getWorkbenchById: (id: string) => Workbench | undefined;
	getRecyclingSourcesById: (id: string) => Recipe[];
	getCraftingRecipes: () => Recipe[];
	getRecyclingRecipes: () => Recipe[];
}

// User data store - persistent user preferences and progress
export interface UserStore {
	// Workbench levels
	workbenchLevels: Record<string, number>;
	hasHydrated: boolean;

	// Quest progress
	activeQuests: string[];
	completedQuests: string[];

	// Item counts (inventory)
	itemCounts: Record<string, number>;

	// Generic storage for other user data
	selections: Record<string, any>;
	stringValues: Record<string, string>;
	numberValues: Record<string, number>;

	// Actions
	setWorkbenchLevel: (id: string, level: number) => void;
	getWorkbenchLevel: (id: string) => number | null;
	resetWorkbenches: () => void;
	setHasHydrated: () => void;

	addActiveQuest: (questId: string) => void;
	removeActiveQuest: (questId: string) => void;
	addCompletedQuest: (questId: string) => void;
	removeCompletedQuest: (questId: string) => void;
	resetQuests: () => void;

	setItemCount: (id: string, count: number) => void;
	getItemCount: (id: string) => number;
	incrementItemCount: (id: string, amount?: number) => void;
	decrementItemCount: (id: string, amount?: number) => void;

	// Generic setters/getters
	setValue: (
		category: "selections" | "stringValues" | "numberValues",
		key: string,
		value: any
	) => void;
	getValue: (category: "selections" | "stringValues" | "numberValues", key: string) => any;

	// Persistence
	exportData: () => any;
	importData: (data: any) => void;
	clearAll: () => void;
}

// UI state store - temporary UI state
export interface UIStore {
	// Item filtering and sorting
	itemFilters: FilterOptions;
	itemSort: SortOptions;

	// Dialog state
	dialogOpen: boolean;
	dialogType: string | null;
	dialogData: any;
	dialogQueue: Item[];

	// Search state
	searchOpen: boolean;

	// Actions
	setItemFilters: (filters: Partial<FilterOptions>) => void;
	setItemSort: (sort: Partial<SortOptions>) => void;
	resetItemFilters: () => void;

	openDialog: (type: string, data: any) => void;
	closeDialog: () => void;
	backDialog: () => void;

	setSearchOpen: (open: boolean) => void;
}
