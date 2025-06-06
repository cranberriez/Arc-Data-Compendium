"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchWorkbenches } from "@/services/dataService";
import { Workbench, WorkbenchUpgradeSummary } from "@/types/items/workbench";
import { getWorkbenchData, saveWorkbenchData, WorkbenchUserData } from "@/utils/cookieUtils";

interface WorkshopContextType {
	workbenches: Workbench[];
	workbenchUserData: WorkbenchUserData[];
	loading: boolean;
	error: Error | null;
	refreshWorkshop: () => Promise<void>;
	updateWorkbenchTier: (workbenchId: string, currentTier: number) => void;
	workbenchUpgradeSummary: Record<string, WorkbenchUpgradeSummary>;
	upgradeWorkbench: (workbenchId: string) => void;
	downgradeWorkbench: (workbenchId: string) => void;
	resetWorkbenches: () => void;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
	const [workbenches, setWorkbenches] = useState<Workbench[]>([]);
	const [workbenchUserData, setWorkbenchUserData] = useState<WorkbenchUserData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	// Load saved workbench data from cookies and initialize missing workbenches with base tier
	const loadWorkbenchUserData = useCallback((workbenches: Workbench[]) => {
		const savedData = workbenches.map((workbench) => {
			const savedWorkbench = getWorkbenchData(workbench.id);
			return {
				workbenchId: workbench.id,
				currentTier: savedWorkbench?.currentTier ?? workbench.baseTier,
			};
		});

		setWorkbenchUserData(savedData);
	}, []);

	// Update workbench tier and save to cookies
	const updateWorkbenchTier = useCallback((workbenchId: string, currentTier: number) => {
		const newData: WorkbenchUserData = { workbenchId, currentTier };

		// Update state
		setWorkbenchUserData((prevData) => {
			const existingIndex = prevData.findIndex((item) => item.workbenchId === workbenchId);
			if (existingIndex >= 0) {
				const newDataArray = [...prevData];
				newDataArray[existingIndex] = newData;
				return newDataArray;
			}
			return [...prevData, newData];
		});

		// Save to cookies
		saveWorkbenchData(newData);
	}, []);

	// Get a summary of all of the items needed to upgrade all workbenches 1 level
	const getWorkbenchUpgradeSummary = useCallback(() => {
		return workbenches.reduce((summary, workbench) => {
			const currentTier =
				workbenchUserData.find((wb) => wb.workbenchId === workbench.id)?.currentTier ??
				workbench.baseTier;
			const nextTier = currentTier + 1;
			const nextTierData = workbench.tiers.find((t) => t.tier === nextTier);

			if (!nextTierData) return summary;

			nextTierData.requiredItems.forEach((item) => {
				if (!summary[item.itemId]) {
					summary[item.itemId] = {
						count: 0,
						usedIn: [],
					};
				}
				summary[item.itemId].count += item.count;

				const workbenchInfo = {
					workbenchId: workbench.id,
					targetTier: nextTier,
				};

				if (!summary[item.itemId].usedIn.some((wb) => wb.workbenchId === workbench.id)) {
					summary[item.itemId].usedIn.push(workbenchInfo);
				}
			});

			return summary;
		}, {} as Record<string, WorkbenchUpgradeSummary>);
	}, [workbenchUserData, workbenches]);

	const workbenchUpgradeSummary = useMemo(
		() => getWorkbenchUpgradeSummary(),
		[getWorkbenchUpgradeSummary]
	);

	// Upgrade workbench tier and update cookie
	const upgradeWorkbench = useCallback(
		(workbenchId: string) => {
			// Get the latest workbenches here, not inside setState
			const workbench = workbenches.find((wb) => wb.id === workbenchId);
			if (!workbench) return;

			setWorkbenchUserData((prevData) => {
				const wbIndex = prevData.findIndex((item) => item.workbenchId === workbenchId);
				const maxTier = Math.max(...workbench.tiers.map((t) => t.tier));
				const currentTier =
					wbIndex >= 0 ? prevData[wbIndex].currentTier : workbench.baseTier;
				if (currentTier < maxTier) {
					const newTier = currentTier + 1;
					const newData: WorkbenchUserData = { workbenchId, currentTier: newTier };
					const newDataArray = wbIndex >= 0 ? [...prevData] : prevData;
					if (wbIndex >= 0) {
						newDataArray[wbIndex] = newData;
					} else {
						newDataArray.push(newData);
					}
					saveWorkbenchData(newData);
					return newDataArray;
				}
				return prevData;
			});
		},
		[workbenches]
	);

	// Downgrade workbench tier and update cookie
	const downgradeWorkbench = useCallback(
		(workbenchId: string) => {
			// Get the latest workbench outside setState
			const workbench = workbenches.find((wb) => wb.id === workbenchId);
			if (!workbench) return;

			setWorkbenchUserData((prevData) => {
				const wbIndex = prevData.findIndex((item) => item.workbenchId === workbenchId);
				const minTier = workbench.baseTier;
				const currentTier =
					wbIndex >= 0 ? prevData[wbIndex].currentTier : workbench.baseTier;
				if (currentTier > minTier) {
					const newTier = currentTier - 1;
					const newData: WorkbenchUserData = { workbenchId, currentTier: newTier };
					const newDataArray = wbIndex >= 0 ? [...prevData] : prevData;
					if (wbIndex >= 0) {
						newDataArray[wbIndex] = newData;
					} else {
						newDataArray.push(newData);
					}
					saveWorkbenchData(newData);
					return newDataArray;
				}
				return prevData;
			});
		},
		[workbenches]
	);

	const resetWorkbenches = () => {
		if (typeof window !== "undefined") {
			const resetData = workbenches.map((workbench) => ({
				workbenchId: workbench.id,
				currentTier: workbench.baseTier,
			}));
			setWorkbenchUserData(resetData);
			resetData.forEach(saveWorkbenchData);
		}
	};

	const fetchWorkshopData = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchWorkbenches();
			setWorkbenches(data);

			// Load saved data for these workbenches and initialize with base tiers
			if (typeof window !== "undefined") {
				loadWorkbenchUserData(data);
			}
		} catch (err) {
			console.error("Failed to fetch workbenches:", err);
			setError(err instanceof Error ? err : new Error("Failed to fetch workbenches"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkshopData();
	}, [fetchWorkshopData]);

	const refreshWorkshop = async () => {
		await fetchWorkshopData();
	};

	return (
		<WorkshopContext.Provider
			value={{
				workbenches,
				workbenchUserData,
				loading,
				error,
				refreshWorkshop,
				updateWorkbenchTier,
				workbenchUpgradeSummary,
				upgradeWorkbench,
				downgradeWorkbench,
				resetWorkbenches,
			}}
		>
			{children}
		</WorkshopContext.Provider>
	);
}

export const useWorkshop = (): WorkshopContextType => {
	const context = useContext(WorkshopContext);
	if (context === undefined) {
		throw new Error("useWorkshop must be used within a WorkshopProvider");
	}
	return context;
};
