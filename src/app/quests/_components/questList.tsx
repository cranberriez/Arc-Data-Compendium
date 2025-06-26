"use client";

import { Quest } from "@/types";
import { QuestItem } from "./questItem";
import { createQuestNodeList } from "@/utils/questUtils";
import { useQuests } from "@/contexts/questContext";

export function QuestList({ quests, firstQuestId }: { quests: Quest[]; firstQuestId: string }) {
	const {
		activeQuests,
		completedQuests,
		addActive,
		removeActive,
		addCompleted,
		removeCompleted,
	} = useQuests();

	const questlineColors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-red-500",
		"bg-yellow-500",
		"bg-purple-500",
		"bg-pink-500",
	];

	const questNodes = createQuestNodeList(quests, firstQuestId);

	const handleComplete = (quest: Quest) => {
		removeActive(quest.id);

		// 1. Build a temporary completed set
		const completedSet = new Set(completedQuests);
		function completeDependenciesToSet(q: Quest) {
			for (const prevQuestId of q.previous) {
				if (!completedSet.has(prevQuestId)) {
					completeDependenciesToSet(quests.find((x) => x.id === prevQuestId)!);
					completedSet.add(prevQuestId);
				}
			}
		}
		completeDependenciesToSet(quest);
		completedSet.add(quest.id);

		// 2. Actually update state
		completeDependencies(quest);
		addCompleted(quest.id);

		// 3. Use completedSet for logic
		for (const nextQuestId of quest.next) {
			const nextQuest = quests.find((q) => q.id === nextQuestId);
			if (
				nextQuest &&
				!completedSet.has(nextQuestId) &&
				nextQuest.previous.every((prevId) => completedSet.has(prevId))
			) {
				addActive(nextQuestId);
			}
		}
	};

	function completeDependencies(quest: Quest, prevQuestId?: string) {
		for (const prevQuestId of quest.previous) {
			if (!completedQuests.includes(prevQuestId)) {
				completeDependencies(quests.find((q) => q.id === prevQuestId)!, quest.id);
				addCompleted(prevQuestId);
			}
		}

		// Update actives for splitting quests leading to the current quest
		if (prevQuestId && quest.next.length > 1) {
			for (const nextQuestId of quest.next) {
				if (!completedQuests.includes(nextQuestId) && nextQuestId !== prevQuestId) {
					addActive(nextQuestId);
				}
			}
		}
	}

	const handleReset = (quest: Quest) => {
		// 1. Build a temporary completed set
		const completedSet = new Set(completedQuests);

		function unCompleteDependentsToSet(q: Quest) {
			for (const nextQuestId of q.next) {
				if (completedSet.has(nextQuestId)) {
					unCompleteDependentsToSet(quests.find((x) => x.id === nextQuestId)!);
					completedSet.delete(nextQuestId);
				}
			}
		}
		unCompleteDependentsToSet(quest);
		completedSet.delete(quest.id);

		// 2. Actually update state
		unCompleteDependents(quest); // This should call removeCompleted for all dependents
		removeCompleted(quest.id);

		// 3. Update actives for this quest and its dependents
		// (A quest is active if all its previous quests are completed and it is not completed)
		function maybeReactivate(q: Quest) {
			if (!completedSet.has(q.id) && q.previous.every((prevId) => completedSet.has(prevId))) {
				addActive(q.id);
			}
			for (const nextQuestId of q.next) {
				const nextQuest = quests.find((x) => x.id === nextQuestId);
				if (nextQuest) maybeReactivate(nextQuest);
			}
		}
		maybeReactivate(quest);
	};

	function unCompleteDependents(quest: Quest) {
		for (const nextQuestId of quest.next) {
			if (completedQuests.includes(nextQuestId)) {
				unCompleteDependents(quests.find((q) => q.id === nextQuestId)!);
				removeCompleted(nextQuestId);
			}
			removeActive(nextQuestId);
		}
	}

	return (
		<ul className="flex flex-col gap-2">
			{questNodes.map((questNode) => (
				<QuestItem
					key={questNode.quest.id}
					quest={questNode.quest}
					questline={questNode.questline[0]}
					questlineColors={questlineColors}
					tags={questNode.tags}
					isActive={activeQuests.includes(questNode.quest.id)}
					isCompleted={completedQuests.includes(questNode.quest.id)}
					handleComplete={() => handleComplete(questNode.quest)}
					handleReset={() => handleReset(questNode.quest)}
				/>
			))}
		</ul>
	);
}
