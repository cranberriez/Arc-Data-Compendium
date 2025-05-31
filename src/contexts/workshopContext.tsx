"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchWorkbenches } from "@/services/dataService";
import { Workbench } from "@/types/items/workbench";
import { getWorkbenchData, saveWorkbenchData, WorkbenchUserData } from "@/utils/cookieUtils";

interface WorkshopContextType {
	workbenches: Workbench[];
	workbenchUserData: WorkbenchUserData[];
	loading: boolean;
	error: Error | null;
	refreshWorkshop: () => Promise<void>;
	updateWorkbenchTier: (workbenchId: string, currentTier: number) => void;
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
	}, []);

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
