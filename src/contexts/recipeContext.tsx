"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { fetchRecipes } from "@/services/dataService";
import { Recipe } from "@/types";

interface RecipeContextType {
	recipes: Recipe[];
	loading: boolean;
	error: Error | null;
	refreshRecipes: () => Promise<void>;
	getRecipeById: (id: string) => Recipe | undefined;
	getRecyclingSourcesById: (id: string) => Recipe[];
	recyclingRecipes: Recipe[];
	craftingRecipes: Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({
	initialRecipes,
	children,
}: {
	initialRecipes: Recipe[];
	children: React.ReactNode;
}) {
	const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
	const [loading, setLoading] = useState<boolean>(false);
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

	const refreshRecipes = async () => {
		await fetchRecipeData();
	};

	const getRecipeById = (id: string) => {
		return recipes.find((recipe) => recipe.id === id);
	};

	const recyclingRecipes = useMemo(
		() => recipes.filter((recipe) => recipe.type === "recycling"),
		[recipes]
	);

	const craftingRecipes = useMemo(
		() => recipes.filter((recipe) => recipe.type === "crafting"),
		[recipes]
	);

	// Get all RECYCLING recipes that output the given item
	const getRecyclingSourcesById = (id: string) => {
		return recyclingRecipes.filter((recipe) =>
			recipe.io?.some((io) => io.role === "output" && io.itemId === id)
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
				recyclingRecipes,
				craftingRecipes,
				getRecyclingSourcesById,
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
