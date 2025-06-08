import { Quest } from "@/types/items/quest";

/**
 * Represents a quest with its assigned questline label and flags for splits, merges, and primary line status.
 */
export type QuestNode = {
	/**
	 * The assigned questline label (e.g., "line_1", "line_2", ...).
	 */
	questline: number;
	/**
	 * The Quest object associated with this node.
	 */
	quest: Quest;
	/**
	 * True if this quest splits into multiple next quests.
	 */
	isSplit: boolean;
	/**
	 * True if this quest has multiple prereqs (merge).
	 */
	isMerge: boolean;
	/**
	 * True if this quest is on the primary line (line_1).
	 */
	isPrimaryLine: boolean;
	/**
	 * The column index for GitHub-style timeline rendering.
	 */
	column: number;
	/**
	 * The columns of this quest's prereqs (for merge connectors).
	 */
	prereqColumns: number[];
	/**
	 * The columns of this quest's nexts (for split connectors).
	 */
	nextColumns: number[];
};

/**
 */
/**
 * Assigns questline labels (line_1, line_2, ...) to quests, reflecting splits and merges in quest progression.
 *
 * - Roots (quests with no prereqs) start with "line_1".
 * - At splits (quests with multiple next quests), the first branch inherits the parent's line, others get new incremented line labels.
 * - At merges (quests with multiple prereqs), the quest inherits the lowest line label from its prereqs, visually merging lines.
 *
 * This enables clear visualization of questlines, with line labels reused at merges and created anew at splits.
 *
 * @param quests Array of Quest objects
 * @returns Array of QuestNode objects with questline labels assigned
 */
export function assignQuestlinesWithColumns(quests: Quest[]): {
	totalColumns: number;
	nodes: QuestNode[];
} {
	// Build a map for fast quest lookup by ID
	const questMap = new Map<string, Quest>();
	quests.forEach((q) => questMap.set(q.id, q));

	// Identify root quests (quests with no prereqs)
	const roots = quests.filter((q) => !q.prereq || q.prereq.length === 0);

	// Track which quest is on which column (line)
	const questColumnMap = new Map<string, number>();
	// For merges, track all columns leading into a quest
	const questPrereqColumns = new Map<string, number[]>();
	// For splits, track all columns leading out
	const questNextColumns = new Map<string, number[]>();

	let maxColumn = 0;
	const nodes: QuestNode[] = [];

	// Helper to recursively assign columns
	function traverse(questId: string, column: number) {
		// Prevent overwriting at merges
		if (questColumnMap.has(questId)) {
			// For merges, collect all columns leading in
			const prevCols = questPrereqColumns.get(questId) || [];
			if (!prevCols.includes(column)) {
				questPrereqColumns.set(questId, [...prevCols, column]);
			}
			return;
		}
		questColumnMap.set(questId, column);
		if (column > maxColumn) maxColumn = column;

		const quest = questMap.get(questId);
		if (!quest) return;

		// Check for split
		const isSplit = !!(quest.next && quest.next.length > 1);
		const isMerge = !!(quest.prereq && quest.prereq.length > 1);

		// Track outgoing columns for splits
		let nextCols: number[] = [];
		if (quest.next && quest.next.length > 0) {
			if (isSplit) {
				// First next stays on same column, others get new columns
				let nextCol = maxColumn + 1;
				quest.next.forEach((nextId, idx) => {
					if (idx === 0) {
						nextCols.push(column);
						traverse(nextId, column);
					} else {
						nextCols.push(nextCol);
						traverse(nextId, nextCol);
						nextCol++;
					}
				});
				if (nextCols.length > 1 && Math.max(...nextCols) > maxColumn) {
					maxColumn = Math.max(...nextCols);
				}
			} else {
				// Linear
				quest.next.forEach((nextId) => {
					nextCols.push(column);
					traverse(nextId, column);
				});
			}
		}
		questNextColumns.set(questId, nextCols);
	}

	// Start traversal from each root quest, using column 0 as the initial line
	roots.forEach((root) => traverse(root.id, 0));

	// After traversal, handle merges (quests with multiple prereqs):
	// Assign the highest column index from all prereqs to the merged quest
	quests.forEach((q) => {
		if (q.prereq && q.prereq.length > 1) {
			const prereqLines = q.prereq
				.map((pid) => questColumnMap.get(pid))
				.filter((v): v is number => typeof v === "number");
			if (prereqLines.length) {
				const highest = Math.max(...prereqLines);
				questColumnMap.set(q.id, highest);
			}
		}
	});

	// Build QuestNode array
	quests.forEach((quest) => {
		const column = questColumnMap.get(quest.id) ?? 0;
		const prereqColumns =
			questPrereqColumns.get(quest.id) ||
			(quest.prereq && quest.prereq.length > 1
				? quest.prereq.map((pid) => questColumnMap.get(pid) ?? 0)
				: []);
		const nextColumns =
			questNextColumns.get(quest.id) ||
			(quest.next ? quest.next.map((nid) => questColumnMap.get(nid) ?? 0) : []);
		const isSplit = !!(quest.next && quest.next.length > 1);
		const isMerge = !!(quest.prereq && quest.prereq.length > 1);
		const isPrimaryLine = column === 0;
		const node: QuestNode = {
			questline: column,
			quest,
			isSplit,
			isMerge,
			isPrimaryLine,
			column,
			prereqColumns,
			nextColumns,
		};
		nodes.push(node);
	});

	return {
		totalColumns: maxColumn + 1,
		nodes,
	};
}
