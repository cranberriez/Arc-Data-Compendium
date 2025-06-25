"use client";

import { createContext, useContext, useState } from "react";
import { Quest } from "@/types";
import { fetchQuests } from "@/services/dataService.client";

type QuestContextType = {
	quests: Quest[];
	setQuests: (quests: Quest[]) => void;
	fetchQuestData: () => void;
	refreshQuests: () => void;
	loading: boolean;
	error: Error | null;
};

export const QuestContext = createContext<QuestContextType | null>(null);

export const QuestProvider = ({
	initialQuests,
	children,
}: {
	initialQuests: Quest[];
	children: React.ReactNode;
}) => {
	const [quests, setQuests] = useState<Quest[]>(initialQuests);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchQuestData = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchQuests();
			setQuests(data);
		} catch (err) {
			console.error("Failed to fetch quests:", err);
			setError(err instanceof Error ? err : new Error("Failed to fetch recipes"));
		} finally {
			setLoading(false);
		}
	};

	const refreshQuests = async () => {
		await fetchQuestData();
	};

	return (
		<QuestContext.Provider
			value={{ quests, setQuests, fetchQuestData, refreshQuests, loading, error }}
		>
			{children}
		</QuestContext.Provider>
	);
};

export const useQuests = (): QuestContextType => {
	const context = useContext(QuestContext);
	if (!context) {
		throw new Error("useQuests must be used within a QuestProvider");
	}
	return context;
};
