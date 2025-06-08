import { Quest } from "@/types/items/quest";

export interface QuestNode {
	quest: Quest;
	children: QuestNode[];
	parents: QuestNode[];
}

/**
 * Builds a linked-list tree (DAG) of quests based on their next/prereq fields.
 * Returns the root nodes (quests with no prereqs).
 */
export function questline(quests: Quest[]): QuestNode[] {
	// Map quest id to QuestNode
	const nodeMap: Record<string, QuestNode> = {};

	// First, create all nodes
	for (const quest of quests) {
		nodeMap[quest.id] = { quest, children: [], parents: [] };
	}

	// Then, link children and parents
	for (const quest of quests) {
		const node = nodeMap[quest.id];
		// Link next quests as children
		if (quest.next) {
			for (const nextId of quest.next) {
				const child = nodeMap[nextId];
				if (child) {
					node.children.push(child);
					child.parents.push(node);
				}
			}
		}
	}

	// Roots: quests with no prereqs (parents)
	const roots = Object.values(nodeMap).filter(
		(node) => !node.quest.prereq || node.quest.prereq.length === 0
	);

	return roots;
}
