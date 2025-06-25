import { Quest } from "@/types";

// QuestNode type: wraps a quest and its questline path
export type QuestNode = {
	quest: Quest;
	questline: number[];
};

/**
 * Creates a sorted list of QuestNodes from a quest array and a starting questId.
 * Branches and merges are handled with questline numbers as described.
 * @param quests Array of Quest objects
 * @param firstQuestId The starting quest's id
 * @returns QuestNode[] in traversal order
 */
export function createQuestNodeList(quests: Quest[], firstQuestId: string): QuestNode[] {
	const questMap = new Map<string, Quest>(quests.map((q) => [q.id, q]));
	const visited = new Set<string>();
	const questlineMap = new Map<string, number>();
	const nodeMap = new Map<string, QuestNode>();
	const result: QuestNode[] = [];

	function traverse(questId: string, questline: number, path: Set<string> = new Set()): void {
		if (!questMap.has(questId) || visited.has(questId)) return;
		if (path.has(questId)) {
			const quest = questMap.get(questId);
			const questName = quest ? quest.name : questId;
			throw new Error(
				`Cycle detected in quest graph involving quest: "${questName}" (id: ${questId}).\n` +
					`Check the 'next' and 'previous' fields for circular references.`
			);
		}
		const quest = questMap.get(questId)!;
		path.add(questId);

		// For merges: pick the lowest questline number from all previous quests
		let currentQuestline = questline;
		if (quest.previous && quest.previous.length > 1) {
			const prevLines = quest.previous
				.map((pid) => questlineMap.get(pid))
				.filter((x) => typeof x === "number") as number[];
			if (prevLines.length) {
				currentQuestline = Math.min(...prevLines);
			}
			// Always converge merges back to 0
			if (currentQuestline !== 0) {
				currentQuestline = 0;
			}
		}

		const node: QuestNode = { quest, questline: [currentQuestline] };
		nodeMap.set(questId, node);
		questlineMap.set(questId, currentQuestline);
		visited.add(questId);
		result.push(node);

		if (quest.next && quest.next.length > 0) {
			for (let idx = 0; idx < quest.next.length; idx++) {
				const nid = quest.next[idx];
				const nextLine = idx === 0 ? currentQuestline : currentQuestline + idx;
				traverseBranch(nid, nextLine, new Set([...path, questId]));
			}
		}
		path.delete(questId);
	}

	function traverseBranch(questId: string, questline: number, parentSet: Set<string>): void {
		// Only add this quest if all its parents have been visited
		const quest = questMap.get(questId);
		if (!quest) return;
		const allParentsVisited =
			!quest.previous ||
			quest.previous.every((pid) => visited.has(pid) || parentSet.has(pid));
		if (!allParentsVisited) return;
		traverse(questId, questline);
	}

	traverse(firstQuestId, 0);

	// After traversal, check for any unvisited quests (disconnected)
	quests.forEach((q) => {
		if (!visited.has(q.id)) {
			traverse(q.id, 0);
		}
	});

	return result;
}
