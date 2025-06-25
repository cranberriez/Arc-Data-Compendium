import { Quest } from "@/types";
import { QuestItem } from "./questItem";
import { createQuestNodeList } from "@/utils/questUtils";

export function QuestList({ quests, firstQuestId }: { quests: Quest[]; firstQuestId: string }) {
	const questlineColors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-red-500",
		"bg-yellow-500",
		"bg-purple-500",
		"bg-pink-500",
	];

	const questNodes = createQuestNodeList(quests, firstQuestId);

	return (
		<ul className="flex flex-col gap-2">
			{questNodes.map((questNode) => (
				<QuestItem
					key={questNode.quest.id}
					quest={questNode.quest}
					questline={questNode.questline[0]}
					questlineColors={questlineColors}
					tags={questNode.tags}
				/>
			))}
		</ul>
	);
}
