import { QuestEntry } from "@/types";

export function QuestDescription({ requirement }: { requirement: QuestEntry | undefined }) {
	if (!requirement) return null;

	const description = requirement.description?.split("\n");

	return (
		<div className="flex-1">
			<ul className="list-disc ml-6">
				{description?.map((line, i) => (
					<li key={i}>{line}</li>
				))}
			</ul>
		</div>
	);
}
