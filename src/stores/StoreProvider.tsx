"use client";

import { useMemo } from "react";
import { createDataStore, DataStoreProvider } from "./dataStore";
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
	const store = useMemo(
		() =>
			createDataStore({
				items: initialData.items,
				recipes: initialData.recipes,
				quests: initialData.quests,
				workbenches: initialData.workbenches,
			}),
		// Memoize per set of initialData references (from server component)
		[initialData]
	);

	return <DataStoreProvider store={store}>{children}</DataStoreProvider>;
}
