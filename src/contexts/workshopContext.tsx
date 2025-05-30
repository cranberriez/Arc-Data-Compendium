"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWorkbenches } from "@/services/dataService";
import { Workbench } from "@/types/items/workbench";

interface WorkshopContextType {
	workbenches: Workbench[];
	workbenchUserData: WorkbenchUserData[];
	loading: boolean;
	error: Error | null;
	refreshWorkshop: () => Promise<void>;
}

export interface WorkbenchUserData {
	workbenchId: string;
	currentTier: number;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
	const [workbenches, setWorkbenches] = useState<Workbench[]>([]);
	const [workbenchUserData, setWorkbenchUserData] = useState<WorkbenchUserData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

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
			value={{ workbenches, workbenchUserData, loading, error, refreshWorkshop }}
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
