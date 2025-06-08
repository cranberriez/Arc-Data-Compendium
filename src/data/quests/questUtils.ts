import { Quest } from "@/types/items/quest";

export type QuestNode = {
	questline: string;
	quest: Quest;
};

/**
 * Assigns questline labels (line_1, line_2, ...) to quests. Splits assign new lines, merges reuse the lowest line from prereqs.
 * @param quests Array of Quest objects
 * @returns Array of QuestNode objects with questline labels assigned
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
export function assignQuestlines(quests: Quest[]): QuestNode[] {
	// Build a map for fast quest lookup by ID
	const questMap = new Map<string, Quest>();
	quests.forEach((q) => questMap.set(q.id, q));

	// Identify root quests (quests with no prereqs)
	// These are the starting points for questline assignment
	const roots = quests.filter((q) => !q.prereq || q.prereq.length === 0);

	// Map questId to questline label (e.g., "line_1", "line_2", ...)
	const questlineMap = new Map<string, string>();
	/**
	 * Recursively assigns questline labels to quests.
	 * - Linear progression: child inherits parent's line label.
	 * - Split: first child keeps parent's line, others get new lines (line_2, line_3, ...) relative to their parent.
	 * - Already visited: skip to avoid overwriting (important for merges).
	 * @param questId Current quest's ID
	 * @param lineLabel Current questline label
	 */
	function traverse(questId: string, lineLabel: string) {
		// Prevent overwriting questline at merges
		if (questlineMap.has(questId)) return;
		questlineMap.set(questId, lineLabel);

		const quest = questMap.get(questId);
		if (!quest || !quest.next) return;

		if (quest.next.length <= 1) {
			quest.next.forEach((nextId) => traverse(nextId, lineLabel));
		} else {
			// Split: use a local counter for this split, starting at 2
			let localLineNum = 2;
			quest.next.forEach((nextId, idx) => {
				if (idx === 0) {
					traverse(nextId, lineLabel);
				} else {
					traverse(nextId, `line_${localLineNum++}`);
				}
			});
		}
	}

	// Start traversal from each root quest, using "line_1" as the initial line label
	roots.forEach((root) => traverse(root.id, "line_1"));

	// After traversal, handle merges (quests with multiple prereqs):
	// Assign the lowest line label from all prereqs to the merged quest
	quests.forEach((q) => {
		if (q.prereq && q.prereq.length > 1) {
			const prereqLines = q.prereq
				.map((pid) => questlineMap.get(pid))
				.filter(Boolean)
				.sort();
			// Use the lowest (alphabetically) line label for the merge
			if (prereqLines.length) questlineMap.set(q.id, prereqLines[0]!);
		}
	});

	// Build the output: each quest gets its assigned questline label
	return quests.map((q) => ({
		questline: questlineMap.get(q.id) ?? "unassigned",
		quest: q,
	}));
}
