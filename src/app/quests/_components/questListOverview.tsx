"use client";

import { useQuests } from "@/contexts/questContext";

export function QuestListOverview({ firstQuestId }: { firstQuestId: string }) {
	const { activeQuests, completedQuests, resetQuests } = useQuests();

	console.log(activeQuests, completedQuests);

	return (
		<div>
			<h2>Quest List Overview</h2>
			<p>First Quest ID: {firstQuestId}</p>
		</div>
	);
}
