import { QuestEntryItem } from "@/types";
import { formatName } from "@/utils/format";

export function QuestRewards({
	rewardItems,
	xpReward,
}: {
	rewardItems: QuestEntryItem[];
	xpReward: number;
}) {
	return (
		<div className="flex-1">
			<ul className="list-disc ml-6">
				<li className="">{xpReward} XP</li>
				{rewardItems?.map((item, i) => (
					<li key={i}>
						{item.count}x {formatName(item.itemId)}
					</li>
				))}
			</ul>
		</div>
	);
}
