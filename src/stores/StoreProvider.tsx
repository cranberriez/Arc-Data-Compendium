"use client";

import { useEffect } from "react";
import { useDataStore } from "./dataStore";
import { Item, Recipe, Quest, Workbench } from "@/types";

interface StoreProviderProps {
	children: React.ReactNode;
	initialData: {
		items: Item[];
		recipes: Recipe[];
		quests: Quest[];
		workbenches: Workbench[];
	};
}

export function StoreProvider({ children, initialData }: StoreProviderProps) {
	const { setItems, setRecipes, setQuests, setWorkbenches } = useDataStore();

	// Initialize stores with server-side data
	useEffect(() => {
		setItems(initialData.items);
		setRecipes(initialData.recipes);
		setQuests(initialData.quests);
		setWorkbenches(initialData.workbenches);
	}, [initialData, setItems, setRecipes, setQuests, setWorkbenches]);

	return <>{children}</>;
}
