import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserStore } from "./types";

const noopStorage: Storage = {
	get length() {
		return 0;
	},
	clear: () => {},
	getItem: () => null,
	key: () => null,
	removeItem: () => {},
	setItem: () => {},
};

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			// Initial state
			workbenchLevels: {},
			hasHydrated: false,
			activeQuests: [],
			completedQuests: [],
			itemCounts: {},
			selections: {},
			stringValues: {},
			numberValues: {},

			// Workbench actions
			setWorkbenchLevel: (id, level) => {
				set((state) => ({
					workbenchLevels: { ...state.workbenchLevels, [id]: level },
				}));
			},

			getWorkbenchLevel: (id) => {
				const { workbenchLevels } = get();
				return workbenchLevels[id] ?? null;
			},

			resetWorkbenches: () => {
				set({ workbenchLevels: {} });
			},

			setHasHydrated: () => {
				set({ hasHydrated: true });
			},

			// Quest actions
			addActiveQuest: (questId) => {
				set((state) => ({
					activeQuests: state.activeQuests.includes(questId)
						? state.activeQuests
						: [...state.activeQuests, questId],
				}));
			},

			removeActiveQuest: (questId) => {
				set((state) => ({
					activeQuests: state.activeQuests.filter((id) => id !== questId),
				}));
			},

			addCompletedQuest: (questId) => {
				set((state) => ({
					completedQuests: state.completedQuests.includes(questId)
						? state.completedQuests
						: [...state.completedQuests, questId],
				}));
			},

			removeCompletedQuest: (questId) => {
				set((state) => ({
					completedQuests: state.completedQuests.filter((id) => id !== questId),
				}));
			},

			resetQuests: () => {
				set({ activeQuests: [], completedQuests: [] });
			},

			// Item count actions
			setItemCount: (id, count) => {
				set((state) => {
					const newCounts = { ...state.itemCounts };
					if (count <= 0) {
						delete newCounts[id];
					} else {
						newCounts[id] = count;
					}
					return { itemCounts: newCounts };
				});
			},

			getItemCount: (id) => {
				const { itemCounts } = get();
				return itemCounts[id] ?? 0;
			},

			incrementItemCount: (id, amount = 1) => {
				const { getItemCount, setItemCount } = get();
				setItemCount(id, getItemCount(id) + amount);
			},

			decrementItemCount: (id, amount = 1) => {
				const { getItemCount, setItemCount } = get();
				setItemCount(id, Math.max(0, getItemCount(id) - amount));
			},

			// Generic value actions
			setValue: (category, key, value) => {
				set((state) => ({
					[category]: { ...state[category], [key]: value },
				}));
			},

			getValue: (category, key) => {
				const state = get();
				return state[category][key];
			},

			// Persistence actions
			exportData: () => {
				const {
					workbenchLevels,
					activeQuests,
					completedQuests,
					itemCounts,
					selections,
					stringValues,
					numberValues,
				} = get();
				return {
					workbenchLevels,
					activeQuests,
					completedQuests,
					itemCounts,
					selections,
					stringValues,
					numberValues,
				};
			},

			importData: (data) => {
				set((state) => ({ ...state, ...data }));
			},

			clearAll: () => {
				set({
					workbenchLevels: {},
					activeQuests: [],
					completedQuests: [],
					itemCounts: {},
					selections: {},
					stringValues: {},
					numberValues: {},
				});
			},
		}),
		{
			name: "arc-user-data", // Storage key
			storage: createJSONStorage(() =>
				typeof window !== "undefined" ? localStorage : noopStorage
			),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated?.();
			},
		}
	)
);
