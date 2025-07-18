"use client";

import { createContext, useContext, useState } from "react";
import { Quest } from "@/types";
import { fetchQuests } from "@/services/dataService.client";
import { useCookies } from "./cookieContext";

type QuestContextType = {
	quests: Quest[];
	setQuests: (quests: Quest[]) => void;
	fetchQuestData: () => void;
	refreshQuests: () => void;

	activeQuests: string[];
	completedQuests: string[];
	isActive: (questId: string) => boolean;
	isCompleted: (questId: string) => boolean;
	addActive: (questId: string) => void;
	removeActive: (questId: string) => void;
	addCompleted: (questId: string) => void;
	removeCompleted: (questId: string) => void;
	resetQuests: () => void;

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

	const {
		data,
		getActiveQuests,
		getCompletedQuests,
		addActiveQuest,
		removeActiveQuest,
		addCompletedQuest,
		removeCompletedQuest,
		resetQuests,
	} = useCookies();

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

	const isActive = (questId: string) => getActiveQuests().includes(questId);
	const isCompleted = (questId: string) => getCompletedQuests().includes(questId);

	const refreshQuests = async () => {
		await fetchQuestData();
	};

	return (
		<QuestContext.Provider
			value={{
				quests,
				setQuests,
				fetchQuestData,
				refreshQuests,
				activeQuests: data.activeQuests,
				completedQuests: data.completedQuests,
				isActive,
				isCompleted,
				addActive: addActiveQuest,
				removeActive: removeActiveQuest,
				addCompleted: addCompletedQuest,
				removeCompleted: removeCompletedQuest,
				resetQuests,
				loading,
				error,
			}}
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
