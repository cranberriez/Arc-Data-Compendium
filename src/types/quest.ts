export type QuestId = string;

export interface QuestObjectiveLink {
	type: string;
	id: string;
}

export interface QuestObjective {
	description: string; // e.g., "Destroy a Wasp"
	count?: number; // e.g., 3 containers
	links?: QuestObjectiveLink[]; // e.g., [{type: 'item', id: 'wasp-driver'}]
}

export interface QuestReward {
	description: string; // e.g., "Wasp Driver"
	count?: number; // e.g., 2
	links?: QuestObjectiveLink[]; // e.g., [{type: 'item', id: 'wasp-driver'}]
}

export interface Quest {
	id: QuestId;
	trader: string;
	name: string;
	prereq: QuestId[] | null; // quest(s) that must be completed first
	next: QuestId[] | null; // quest(s) this leads to
	requirements: QuestObjective[];
	rewards: QuestReward[];
	dialog?: string;
	location?: string; // can be single, multiple, or "any"
	link?: string; // wiki link
}
