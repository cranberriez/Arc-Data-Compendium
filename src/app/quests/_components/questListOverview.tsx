"use client";

import { useQuests } from "@/contexts/questContext";
import ConfirmationButton from "@/components/confirmation-button";
import { Button } from "@/components/ui/button";
import { formatName } from "@/utils/format";

export function QuestListOverview({ firstQuestId }: { firstQuestId: string }) {
	const { addActive, activeQuests, completedQuests, resetQuests } = useQuests();

	const formattedQuestNames = activeQuests.map((id) => formatName(id));

	return (
		<div className="w-full flex items-center">
			<div className="flex flex-row items-center gap-2">
				<p>
					Current Quest{activeQuests.length > 1 ? "s" : ""}:{" "}
					{formattedQuestNames.join(", ")}
				</p>
			</div>
			<div className="flex flex-row items-center gap-2 ml-auto">
				<ConfirmationButton
					onClick={resetQuests}
					confirmText="Reset"
					cancelText="Cancel"
					title="Reset All Stored Quest Data?"
					description="This action cannot be undone and will reset quest data cookies to the defaults, removing any completed quests."
				>
					<Button>Reset Quests</Button>
				</ConfirmationButton>
			</div>
		</div>
	);
}
