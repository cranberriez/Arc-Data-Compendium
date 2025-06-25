"use client";

import { useQuests } from "@/contexts/questContext";
import { useEffect } from "react";

export function QuestListOverview({ firstQuestId }: { firstQuestId: string }) {
	const { addActive, activeQuests, completedQuests, resetQuests } = useQuests();

	// Fallback for new users with no active quests
	useEffect(() => {
		if (activeQuests.length === 0 && completedQuests.length === 0) {
			addActive(firstQuestId);
		}
	}, [activeQuests, completedQuests]);

	// remove display output for now
	return null;

	return (
		<div className="w-full flex border-2 border-arcvault-primary-500/50 h-16 rounded-lg">
			{activeQuests.join(", ")}
		</div>
	);
}
