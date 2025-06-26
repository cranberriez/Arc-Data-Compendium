"use client";

import { useQuests } from "@/contexts/questContext";
import { useEffect } from "react";
import ConfirmationButton from "@/components/confirmation-button";

export function QuestListOverview({ firstQuestId }: { firstQuestId: string }) {
	const { addActive, activeQuests, completedQuests, resetQuests } = useQuests();

	return (
		<div className="w-full flex items-center border-2 h-16 rounded-lg">
			<ConfirmationButton
				children="Reset Quests"
				onClick={resetQuests}
				variant="destructive"
				confirmText="Reset"
				confirmVariant="destructive"
				cancelText="Cancel"
				cancelVariant="outline"
			/>
		</div>
	);
}
