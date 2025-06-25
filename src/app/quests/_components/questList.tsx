import { Quest } from "@/types";
import { QuestItem } from "./questItem";

export function QuestList({ quests }: { quests: Quest[] }) {
	const questlineColors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-red-500",
		"bg-yellow-500",
		"bg-purple-500",
		"bg-pink-500",
	];

	return (
		<ul className="flex flex-col gap-2">
			{quests.map((quest) => (
				<QuestItem
					key={quest.id}
					quest={quest}
				/>
			))}
		</ul>
	);
}
