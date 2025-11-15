export default function QuestList() {
	return null;
}

// "use client";

// import { Quest } from "@/types";
// import { QuestItem } from "./questItem";
// import { createQuestNodeList } from "@/utils/questUtils";
// import { useQuests } from "@/contexts/questContext";
// import { useState, useEffect } from "react";

// export function QuestList({ quests, firstQuestId }: { quests: Quest[]; firstQuestId: string }) {
// 	const {
// 		activeQuests,
// 		completedQuests,
// 		addActive,
// 		removeActive,
// 		addCompleted,
// 		removeCompleted,
// 	} = useQuests();

// 	const questlineColors = [
// 		"bg-blue-500",
// 		"bg-green-500",
// 		"bg-red-500",
// 		"bg-yellow-500",
// 		"bg-purple-500",
// 		"bg-pink-500",
// 	];

// 	const questNodes = createQuestNodeList(quests, firstQuestId);

// 	// Helper function to find a quest by ID
// 	const findQuest = (id: string): Quest => quests.find((q) => q.id === id)!;

// 	// Helper function to check if all prerequisites are completed
// 	const areAllPrerequisitesCompleted = (quest: Quest, completedIds: Set<string>): boolean => {
// 		return quest.previous.every((prevId) => completedIds.has(prevId));
// 	};

// 	const handleComplete = (quest: Quest) => {
// 		// Remove from active quests immediately
// 		removeActive(quest.id);

// 		// Create a set to track all quests that will be completed
// 		const newCompletedSet = new Set(completedQuests);

// 		// Recursive function to mark all dependencies as completed
// 		const processCompletedQuest = (q: Quest, fromQuestId?: string) => {
// 			// First complete all prerequisites recursively
// 			for (const prevQuestId of q.previous) {
// 				if (!newCompletedSet.has(prevQuestId)) {
// 					const prevQuest = findQuest(prevQuestId);
// 					processCompletedQuest(prevQuest, q.id);
// 					newCompletedSet.add(prevQuestId);
// 					addCompleted(prevQuestId);
// 					// Make sure to remove from active when completing
// 					removeActive(prevQuestId);
// 				}
// 			}

// 			// Mark this quest as completed if it's not already
// 			if (!newCompletedSet.has(q.id)) {
// 				newCompletedSet.add(q.id);
// 				addCompleted(q.id);
// 				// Make sure to remove from active when completing
// 				removeActive(q.id);
// 			}

// 			// Handle splitting paths - activate other branches if this is coming from a specific quest
// 			if (fromQuestId && q.next.length > 1) {
// 				for (const nextQuestId of q.next) {
// 					if (!newCompletedSet.has(nextQuestId) && nextQuestId !== fromQuestId) {
// 						addActive(nextQuestId);
// 					}
// 				}
// 			}

// 			// Activate next quests if all their prerequisites are now completed
// 			for (const nextQuestId of q.next) {
// 				const nextQuest = findQuest(nextQuestId);
// 				if (
// 					!newCompletedSet.has(nextQuestId) &&
// 					areAllPrerequisitesCompleted(nextQuest, newCompletedSet)
// 				) {
// 					addActive(nextQuestId);
// 				}
// 			}
// 		};

// 		// Process the quest that was completed
// 		processCompletedQuest(quest);
// 	};

// 	const handleReset = (quest: Quest) => {
// 		// Create a set to track the updated completion state
// 		const newCompletedSet = new Set(completedQuests);

// 		// Recursive function to uncomplete a quest and all its dependents
// 		const processResetQuest = (q: Quest) => {
// 			// First, remove this quest from completed
// 			if (newCompletedSet.has(q.id)) {
// 				newCompletedSet.delete(q.id);
// 				removeCompleted(q.id);
// 			}

// 			// Remove from active quests as well
// 			removeActive(q.id);

// 			// Then recursively process all dependent quests
// 			for (const nextQuestId of q.next) {
// 				if (newCompletedSet.has(nextQuestId)) {
// 					processResetQuest(findQuest(nextQuestId));
// 				}
// 				// Always remove from active regardless of completion status
// 				removeActive(nextQuestId);
// 			}
// 		};

// 		// Process the quest that was reset
// 		processResetQuest(quest);

// 		// Reactivate quests that should be active based on the new completion state
// 		const reactivateQuests = (q: Quest) => {
// 			// A quest is active if all its prerequisites are completed and it's not completed
// 			if (!newCompletedSet.has(q.id) && areAllPrerequisitesCompleted(q, newCompletedSet)) {
// 				addActive(q.id);
// 			}

// 			// Check next quests recursively
// 			for (const nextQuestId of q.next) {
// 				reactivateQuests(findQuest(nextQuestId));
// 			}
// 		};

// 		// Start reactivation from the reset quest
// 		reactivateQuests(quest);
// 	};

// 	// State for UI preferences
// 	const [hideCompleted, setHideCompleted] = useState<boolean>(false);
// 	const [compactView, setCompactView] = useState<boolean>(false);

// 	// Listen for preference changes from QuestListOverview
// 	useEffect(() => {
// 		const handlePreferencesChanged = (e: CustomEvent) => {
// 			const { hideCompleted: newHideCompleted, compactView: newCompactView } = e.detail;
// 			setHideCompleted(newHideCompleted);
// 			setCompactView(newCompactView);
// 		};

// 		document.addEventListener(
// 			"questViewPreferencesChanged",
// 			handlePreferencesChanged as EventListener
// 		);

// 		return () => {
// 			document.removeEventListener(
// 				"questViewPreferencesChanged",
// 				handlePreferencesChanged as EventListener
// 			);
// 		};
// 	}, []);

// 	// Filter quests based on preferences
// 	const filteredQuestNodes = hideCompleted
// 		? questNodes.filter(node => !completedQuests.includes(node.quest.id))
// 		: questNodes;

// 	return (
// 		<ul className={`flex flex-col ${compactView ? 'gap-1' : 'gap-2'}`}>
// 			{filteredQuestNodes.map((questNode) => (
// 				<QuestItem
// 					key={questNode.quest.id}
// 					quest={questNode.quest}
// 					questline={questNode.questline[0]}
// 					questlineColors={questlineColors}
// 					tags={questNode.tags}
// 					isActive={activeQuests.includes(questNode.quest.id)}
// 					isCompleted={completedQuests.includes(questNode.quest.id)}
// 					handleComplete={() => handleComplete(questNode.quest)}
// 					handleReset={() => handleReset(questNode.quest)}
// 					compactView={compactView}
// 				/>
// 			))}
// 		</ul>
// 	);
// }
