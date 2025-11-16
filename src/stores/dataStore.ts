import { DataStore } from "./types";
import { createStore, type StoreApi } from "zustand/vanilla";
import React, { createContext, useContext } from "react";
import { useStore } from "zustand";

export type DataStoreApi = StoreApi<DataStore>;

export const createDataStore = (initial?: Partial<DataStore>): DataStoreApi =>
	createStore<DataStore>((set, get) => ({
		// Initial state
		items: initial?.items ?? [],
		recipes: initial?.recipes ?? [],
		quests: initial?.quests ?? [],
		workbenches: initial?.workbenches ?? [],
		isLoading: initial?.isLoading ?? false,
		error: initial?.error ?? null,

		// Actions
		setItems: (items) => set({ items }),
		setRecipes: (recipes) => set({ recipes }),
		setQuests: (quests) => set({ quests }),
		setWorkbenches: (workbenches) => set({ workbenches }),
		setLoading: (isLoading) => set({ isLoading }),
		setError: (error) => set({ error }),

		// Batched action to reduce notifications on initial hydration
		setAll: ({ items, recipes, quests, workbenches }) =>
			set({ items, recipes, quests, workbenches }),

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

const DataStoreContext = createContext<DataStoreApi | null>(null);

export function DataStoreProvider({ store, children }: { store: DataStoreApi; children: React.ReactNode }) {
    return React.createElement(DataStoreContext.Provider, { value: store }, children);
}

export function useDataStore<T>(selector: (state: DataStore) => T): T {
	const store = useContext(DataStoreContext);
	if (!store) {
		throw new Error("useDataStore must be used within a DataStoreProvider");
	}
	return useStore(store, selector);
}
