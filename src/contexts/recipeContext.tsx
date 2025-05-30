"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchRecipes } from "@/services/dataService";
import { Recipe } from "@/types/items/recipe";

interface RecipeContextType {
	recipes: Recipe[];
	loading: boolean;
	error: Error | null;
	refreshRecipes: () => Promise<void>;
	getRecipeById: (id: string) => Recipe | undefined;
	getRecipesByWorkbench: (workbenchId: string) => Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchRecipeData = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchRecipes();
			setRecipes(data);
		} catch (err) {
			console.error("Failed to fetch recipes:", err);
			setError(err instanceof Error ? err : new Error("Failed to fetch recipes"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecipeData();
	}, []);

	const refreshRecipes = async () => {
		await fetchRecipeData();
	};

	const getRecipeById = (id: string) => {
		return recipes.find((recipe) => recipe.id === id);
	};

	const getRecipesByWorkbench = (workbenchId: string) => {
		return recipes.filter(
			(recipe) => recipe.workbench?.some((wb) => wb.workbench === workbenchId) ?? false
		);
	};

	return (
		<RecipeContext.Provider
			value={{
				recipes,
				loading,
				error,
				refreshRecipes,
				getRecipeById,
				getRecipesByWorkbench,
			}}
		>
			{children}
		</RecipeContext.Provider>
	);
}

export const useRecipes = (): RecipeContextType => {
	const context = useContext(RecipeContext);
	if (context === undefined) {
		throw new Error("useRecipes must be used within a RecipeProvider");
	}
	return context;
};
