import { create } from "zustand";
import { DataStore } from "./types";

export const useDataStore = create<DataStore>((set, get) => ({
	// Initial state
	items: [],
	recipes: [],
	quests: [],
	workbenches: [],
	isLoading: false,
	error: null,

	// Actions
	setItems: (items) => set({ items }),
	setRecipes: (recipes) => set({ recipes }),
	setQuests: (quests) => set({ quests }),
	setWorkbenches: (workbenches) => set({ workbenches }),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),

	// Selectors
	getItemById: (id) => {
		const { items } = get();
		return items.find((item) => item.id === id);
	},

	getRecipeById: (id) => {
		const { recipes } = get();
		return recipes.find((recipe) => recipe.id === id);
	},

	getQuestById: (id) => {
		const { quests } = get();
		return quests.find((quest) => quest.id === id);
	},

	getWorkbenchById: (id) => {
		const { workbenches } = get();
		return workbenches.find((workbench) => workbench.id === id);
	},

	getRecyclingSourcesById: (id) => {
		const { recipes } = get();
		const filteredRecipes = recipes.filter(
			(recipe) =>
				recipe.type === "recycling" &&
				recipe.io?.some((io) => io.role === "output" && io.itemId === id)
		);

		return filteredRecipes;
	},

	getCraftingRecipes: () => {
		const { recipes } = get();
		return recipes.filter((recipe) => recipe.type === "crafting");
	},

	getCraftingRecipesById: (id) => {
		const { recipes } = get();
		return recipes.filter((recipe) => recipe.id === id);
	},

	getRecyclingRecipes: () => {
		const { recipes } = get();
		return recipes.filter((recipe) => recipe.type === "recycling");
	},

	getRecyclingRecipesById: (id) => {
		const { recipes } = get();
		return recipes.filter((recipe) => recipe.id === id);
	},
}));
