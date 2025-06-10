"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchWorkbenches } from "@/services/dataService";
import { Workbench, WorkbenchUpgradeSummary } from "@/types/items/workbench";
import { useCookies } from "@/contexts/cookieContext";

interface WorkshopContextType {
	workbenches: Workbench[];
	loading: boolean;
	error: Error | null;

	refreshWorkshop: () => Promise<void>;
	getLevel: (workbenchId: string) => number;
	setLevel: (workbenchId: string, level: number) => void;
	upgradeWorkbench: (workbenchId: string) => void;
	downgradeWorkbench: (workbenchId: string) => void;
	resetWorkbenches: () => void;

	workbenchUpgradeSummary: Record<string, WorkbenchUpgradeSummary>;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
	const { getWorkbenchLevel, setWorkbenchLevel, resetWorkbenches } = useCookies();
	const [workbenches, setWorkbenches] = useState<Workbench[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	// Get workbench tier from cookies
	const getLevel = useCallback(
		(workbenchId: string) => {
			return (
				getWorkbenchLevel(workbenchId) ??
				workbenches.find((wb) => wb.id === workbenchId)?.baseTier ??
				0
			);
		},
		[getWorkbenchLevel, workbenches]
	);

	// Set workbench tier and save to cookies
	const setLevel = useCallback(
		(workbenchId: string, level: number) => {
			setWorkbenchLevel(workbenchId, level);
		},
		[setWorkbenchLevel]
	);

	// Get a summary of all of the items needed to upgrade all workbenches 1 level
	const getWorkbenchUpgradeSummary = useCallback(() => {
		return workbenches.reduce((summary, workbench) => {
			const currentTier = getLevel(workbench.id);
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
	}, [getLevel, workbenches]);

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

			const currentTier = getLevel(workbenchId);
			const maxTier = workbench.tiers.length;
			if (currentTier < maxTier) {
				setLevel(workbenchId, currentTier + 1);
			}
		},
		[getLevel, setLevel, workbenches]
	);

	// Downgrade workbench tier and update cookie
	const downgradeWorkbench = useCallback(
		(workbenchId: string) => {
			// Get the latest workbench outside setState
			const workbench = workbenches.find((wb) => wb.id === workbenchId);
			if (!workbench) return;

			const currentTier = getLevel(workbenchId);
			const minTier = workbench.baseTier;
			if (currentTier > minTier) {
				setLevel(workbenchId, currentTier - 1);
			}
		},
		[getLevel, setLevel, workbenches]
	);

	const fetchWorkshopData = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchWorkbenches();
			setWorkbenches(data);
		} catch (err) {
			console.error("Failed to fetch workbenches:", err);
			setError(err instanceof Error ? err : new Error("Failed to fetch workbenches"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkshopData();
	}, []);

	const refreshWorkshop = async () => {
		await fetchWorkshopData();
	};

	return (
		<WorkshopContext.Provider
			value={{
				workbenches,
				loading,
				error,
				refreshWorkshop,
				getLevel,
				setLevel,
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
