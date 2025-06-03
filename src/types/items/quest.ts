export type QuestId = string;

export type QuestObjectiveLink =
	| { type: "item"; id: string } // links to an item in your system
	| { type: "enemy"; id: string } // links to an enemy (future)
	| { type: "location"; id: string } // links to a location
	| { type: "wiki"; url: string }; // external link (e.g., wiki)

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
	prereq: QuestId[]; // quest(s) that must be completed first
	next: QuestId[]; // quest(s) this leads to
	requirements: QuestObjective[];
	rewards: QuestReward[];
	dialog: string;
	location: string | string[]; // can be single, multiple, or "any"
	link: string; // wiki link
}
