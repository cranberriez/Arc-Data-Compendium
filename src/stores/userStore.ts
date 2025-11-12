import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserStore } from "./types";

// Helper functions for cookie persistence (similar to your current implementation)
const COOKIE_KEYS = {
	workbenchLevels: "workbenchLevels",
	activeQuests: "activeQuests",
	completedQuests: "completedQuests",
	itemCounts: "itemCounts",
	selections: "selections",
	stringValues: "stringValues",
	numberValues: "numberValues",
};

const safeParseJSON = (value: string | null, defaultValue: any) => {
	if (!value) return defaultValue;
	try {
		return JSON.parse(value);
	} catch {
		return defaultValue;
	}
};

const safeSaveToCookie = (key: string, value: any) => {
	if (typeof document === "undefined") return;
	try {
		document.cookie = `${key}=${JSON.stringify(value)}; path=/; max-age=${
			60 * 60 * 24 * 365
		}; secure; samesite=strict`;
	} catch (error) {
		console.error("Failed to save to cookie:", error);
	}
};

const getCookie = (key: string): string | null => {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === key) {
			return decodeURIComponent(value);
		}
	}
	return null;
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
			// Custom storage to use cookies instead of localStorage
			storage: {
				getItem: (name) => {
					const value = getCookie(name);
					return value ? JSON.parse(value) : null;
				},
				setItem: (name, value) => {
					safeSaveToCookie(name, JSON.stringify(value));
				},
				removeItem: (name) => {
					if (typeof document !== "undefined") {
						document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
					}
				},
			},
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated?.();
			},
		}
	)
);
