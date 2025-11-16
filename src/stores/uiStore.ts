import { create } from "zustand";
import { UIStore } from "./types";
import { Item } from "@/types";

const defaultFilterState = {
	searchQuery: "",
	rarities: [],
	categories: [],
	showRecyclable: false,
	showCraftable: false,
	showHasStats: false,
};

const defaultSortState = {
	sortField: "none" as const,
	sortOrder: "none" as const,
};

export const useUIStore = create<UIStore>((set, get) => ({
	// Initial state
	itemFilters: defaultFilterState,
	itemSort: defaultSortState,
	dialogOpen: false,
	dialogType: null,
	dialogData: null,
	dialogQueue: [],
	searchOpen: false,

	// Item filtering actions
	setItemFilters: (filters) => {
		set((state) => ({
			itemFilters: { ...state.itemFilters, ...filters },
		}));
	},

	setItemSort: (sort) => {
		set((state) => ({
			itemSort: { ...state.itemSort, ...sort },
		}));
	},

	resetItemFilters: () => {
		set({
			itemFilters: defaultFilterState,
			itemSort: defaultSortState,
		});
	},

	// Dialog actions
	openDialog: (type, data) => {
		set((state) => {
			let newQueue = [...state.dialogQueue];

			// If a dialog is already open, add current data to queue
			if (state.dialogOpen && state.dialogData) {
				// Remove any existing instance of this item from the queue
				newQueue = newQueue.filter((item: Item) => item.id !== state.dialogData.id);
				// Add the item to the end of the queue
				newQueue.push(state.dialogData);
			}

			return {
				dialogOpen: true,
				dialogType: type,
				dialogData: data,
				dialogQueue: newQueue,
			};
		});
	},

	closeDialog: () => {
		set({
			dialogOpen: false,
			dialogType: null,
			dialogData: null,
			dialogQueue: [],
		});
	},

	backDialog: () => {
		set((state) => {
			if (state.dialogQueue.length > 0) {
				const lastItem = state.dialogQueue[state.dialogQueue.length - 1];
				return {
					dialogOpen: true,
					dialogType: state.dialogType,
					dialogData: lastItem,
					dialogQueue: state.dialogQueue.slice(0, -1),
				};
			}
			return state;
		});
	},

	// Search actions
	setSearchOpen: (open) => {
		set({ searchOpen: open });
	},
}));
