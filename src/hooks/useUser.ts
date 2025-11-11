import { useUserStore } from "@/stores";
import { UserStore } from "@/stores/types";

// Hook for workbench management
export const useWorkbenchLevels = () => {
	const workbenchLevels = useUserStore((state: UserStore) => state.workbenchLevels);
	const setWorkbenchLevel = useUserStore((state: UserStore) => state.setWorkbenchLevel);
	const getWorkbenchLevel = useUserStore((state: UserStore) => state.getWorkbenchLevel);
	const resetWorkbenches = useUserStore((state: UserStore) => state.resetWorkbenches);

	return {
		workbenchLevels,
		setWorkbenchLevel,
		getWorkbenchLevel,
		resetWorkbenches,
	};
};

// Hook for quest management
export const useQuestProgress = () => {
	const activeQuests = useUserStore((state: UserStore) => state.activeQuests);
	const completedQuests = useUserStore((state: UserStore) => state.completedQuests);
	const addActiveQuest = useUserStore((state: UserStore) => state.addActiveQuest);
	const removeActiveQuest = useUserStore((state: UserStore) => state.removeActiveQuest);
	const addCompletedQuest = useUserStore((state: UserStore) => state.addCompletedQuest);
	const removeCompletedQuest = useUserStore((state: UserStore) => state.removeCompletedQuest);
	const resetQuests = useUserStore((state: UserStore) => state.resetQuests);

	// Helper functions
	const isActive = (questId: string) => activeQuests.includes(questId);
	const isCompleted = (questId: string) => completedQuests.includes(questId);

	return {
		activeQuests,
		completedQuests,
		addActiveQuest,
		removeActiveQuest,
		addCompletedQuest,
		removeCompletedQuest,
		resetQuests,
		isActive,
		isCompleted,
	};
};

// Hook for item inventory management
export const useItemCounts = () => {
	const itemCounts = useUserStore((state: UserStore) => state.itemCounts);
	const setItemCount = useUserStore((state: UserStore) => state.setItemCount);
	const getItemCount = useUserStore((state: UserStore) => state.getItemCount);
	const incrementItemCount = useUserStore((state: UserStore) => state.incrementItemCount);
	const decrementItemCount = useUserStore((state: UserStore) => state.decrementItemCount);

	return {
		itemCounts,
		setItemCount,
		getItemCount,
		incrementItemCount,
		decrementItemCount,
	};
};

// Hook for generic user data storage
export const useUserData = () => {
	const setValue = useUserStore((state: UserStore) => state.setValue);
	const getValue = useUserStore((state: UserStore) => state.getValue);
	const exportData = useUserStore((state: UserStore) => state.exportData);
	const importData = useUserStore((state: UserStore) => state.importData);
	const clearAll = useUserStore((state: UserStore) => state.clearAll);

	return {
		setValue,
		getValue,
		exportData,
		importData,
		clearAll,
	};
};
