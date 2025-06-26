"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookieUtils";

// Define the structure of our cookie data
interface CookieData {
	workbenchLevels: Record<string, number>;
	activeQuests: string[];
	completedQuests: string[];
	itemCounts: Record<string, number>;
	selections: Record<string, string | number | boolean>;
	stringValues: Record<string, string>;
	numberValues: Record<string, number>;
}

// Initial state
const initialCookieData: CookieData = {
	workbenchLevels: {},
	activeQuests: ["topside"],
	completedQuests: [],
	itemCounts: {},
	selections: {},
	stringValues: {},
	numberValues: {},
};

// Context type
interface CookieContextType {
	data: CookieData;

	// Workbench methods
	getWorkbenchLevel: (id: string) => number | null;
	setWorkbenchLevel: (id: string, level: number) => number;
	resetWorkbenches: () => void;

	// Quest methods
	getActiveQuests: () => string[];
	addActiveQuest: (questId: string) => void;
	removeActiveQuest: (questId: string) => void;
	getCompletedQuests: () => string[];
	addCompletedQuest: (questId: string) => void;
	removeCompletedQuest: (questId: string) => void;
	resetQuests: () => void;

	// Item count methods
	getItemCount: (id: string) => number;
	getAllItemCounts: () => Record<string, number>;
	getItemCountEntries: () => [string, number][];
	setItemCount: (id: string, count: number) => void;
	incrementItemCount: (id: string, amount?: number) => void;
	decrementItemCount: (id: string, amount?: number) => void;

	// Generic accessor methods
	get: <T = any>(category: keyof CookieData, key: string) => T;
	set: (category: keyof CookieData, key: string, value: any) => void;
	remove: (category: keyof CookieData, key: string) => void;

	// Utility methods
	clearAll: () => void;
	clearAllSiteCookies: () => void;
	exportData: () => CookieData;
	importData: (data: Partial<CookieData>) => void;
	exportToHash: () => string;
	importFromHash: (hash: string) => boolean;
	exportToCSV: () => void;
	importFromCSV: (file: File) => Promise<boolean>;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

// Cookie keys
const COOKIE_KEYS: Record<keyof CookieData, string> = {
	workbenchLevels: "workbench_levels",
	activeQuests: "active_quests",
	completedQuests: "completed_quests",
	itemCounts: "item_counts",
	selections: "selections",
	stringValues: "string_values",
	numberValues: "number_values",
};

// Helper functions
function safeParseJSON<T>(value: string | null, fallback: T): T {
	if (!value) return fallback;
	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
}

function safeSaveToCookie(key: string, value: any): void {
	try {
		setCookie(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error saving ${key}:`, error);
	}
}

interface CookieProviderProps {
	children: ReactNode;
}

export function CookieProvider({ children }: CookieProviderProps) {
	const [data, setData] = useState<CookieData>(initialCookieData);

	// Load data from cookies on mount
	useEffect(() => {
		const loadedData: CookieData = {
			workbenchLevels: safeParseJSON(getCookie(COOKIE_KEYS.workbenchLevels), {}),
			activeQuests: safeParseJSON(getCookie(COOKIE_KEYS.activeQuests), [""]),
			completedQuests: safeParseJSON(getCookie(COOKIE_KEYS.completedQuests), []),
			itemCounts: safeParseJSON(getCookie(COOKIE_KEYS.itemCounts), {}),
			selections: safeParseJSON(getCookie(COOKIE_KEYS.selections), {}),
			stringValues: safeParseJSON(getCookie(COOKIE_KEYS.stringValues), {}),
			numberValues: safeParseJSON(getCookie(COOKIE_KEYS.numberValues), {}),
		};
		setData(loadedData);
	}, []);

	// Generic update function
	const updateCategory = <T extends keyof CookieData>(
		category: T,
		updater: (current: CookieData[T]) => CookieData[T]
	) => {
		setData((prev) => {
			const newValue = updater(prev[category]);
			const newData = { ...prev, [category]: newValue };

			safeSaveToCookie(COOKIE_KEYS[category], newValue);
			return newData;
		});
	};

	// Generic accessors
	const get = <T = any,>(category: keyof CookieData, key: string): T => {
		const categoryData = data[category];
		if (typeof categoryData === "object" && categoryData !== null) {
			return (categoryData as Record<string, any>)[key];
		}
		return categoryData as T;
	};

	const set = (category: keyof CookieData, key: string, value: any): void => {
		updateCategory(category, (current) => ({
			...(current as Record<string, any>),
			[key]: value,
		}));
	};

	const remove = (category: keyof CookieData, key: string): void => {
		updateCategory(category, (current) => {
			const newObj = { ...(current as Record<string, any>) };
			delete newObj[key];
			return newObj;
		});
	};

	// Convenience methods using generic accessors
	const getWorkbenchLevel = (id: string): number | null => get("workbenchLevels", id);
	const setWorkbenchLevel = (id: string, level: number): number => {
		set("workbenchLevels", id, level);
		return level;
	};
	const resetWorkbenches = () => {
		updateCategory("workbenchLevels", () => ({}));
	};

	// Multi-quest methods
	const getActiveQuests = (): string[] => data.activeQuests || [];
	const addActiveQuest = (questId: string): void => {
		updateCategory("activeQuests", (prev: string[]) =>
			prev.includes(questId) ? prev : [...prev, questId]
		);
	};
	const removeActiveQuest = (questId: string): void => {
		updateCategory("activeQuests", (prev: string[]) => prev.filter((id) => id !== questId));
	};

	const getCompletedQuests = (): string[] => data.completedQuests || [];
	const addCompletedQuest = (questId: string): void => {
		updateCategory("completedQuests", (prev: string[]) =>
			prev.includes(questId) ? prev : [...prev, questId]
		);
	};
	const removeCompletedQuest = (questId: string): void => {
		updateCategory("completedQuests", (prev: string[]) => prev.filter((id) => id !== questId));
	};
	const resetQuests = () => {
		updateCategory("activeQuests", () => initialCookieData.activeQuests);
		updateCategory("completedQuests", () => initialCookieData.completedQuests);
	};

	const getItemCount = (id: string): number => get("itemCounts", id) || 0;
	const getAllItemCounts = (): Record<string, number> => ({ ...data.itemCounts });
	const getItemCountEntries = (): [string, number][] => Object.entries(data.itemCounts);

	const setItemCount = (id: string, count: number): void => {
		if (count <= 0) {
			remove("itemCounts", id);
		} else {
			set("itemCounts", id, count);
		}
	};

	const incrementItemCount = (id: string, amount: number = 1): void => {
		setItemCount(id, getItemCount(id) + amount);
	};

	const decrementItemCount = (id: string, amount: number = 1): void => {
		setItemCount(id, Math.max(0, getItemCount(id) - amount));
	};

	// Utility methods
	const clearAll = (): void => {
		setData(initialCookieData);
		Object.values(COOKIE_KEYS).forEach((key) => deleteCookie(key));
	};

	const clearAllSiteCookies = (): void => {
		if (typeof document === "undefined") return;

		const cookies = document.cookie.split(";");
		for (const cookie of cookies) {
			const cookieName = cookie.trim().split("=")[0];
			if (cookieName) {
				document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
				document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure;`;
				document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; secure;`;
			}
		}
		setData(initialCookieData);
	};

	const exportData = (): CookieData => ({ ...data });

	const importData = (importedData: Partial<CookieData>): void => {
		const newData = { ...data, ...importedData };
		setData(newData);

		// Save to cookies
		(Object.keys(importedData) as Array<keyof CookieData>).forEach((key) => {
			if (key === "activeQuests" || key === "completedQuests") {
				safeSaveToCookie(COOKIE_KEYS[key], newData[key] || []);
			} else {
				safeSaveToCookie(COOKIE_KEYS[key], newData[key]);
			}
		});
	};

	const exportToHash = (): string => {
		try {
			return btoa(JSON.stringify(data));
		} catch (error) {
			console.error("Error exporting to hash:", error);
			return "";
		}
	};

	const importFromHash = (hash: string): boolean => {
		try {
			const importedData = JSON.parse(atob(hash)) as CookieData;
			if (typeof importedData === "object" && importedData !== null) {
				importData(importedData);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error importing from hash:", error);
			return false;
		}
	};

	const exportToCSV = (): void => {
		try {
			const rows = ["Type,Key,Value"];

			// Helper to add rows for each category
			const addRows = (type: string, obj: Record<string, any>) => {
				Object.entries(obj).forEach(([key, value]) => {
					const valueStr = typeof value === "string" ? `"${value}"` : value;
					rows.push(`${type},"${key}",${valueStr}`);
				});
			};

			addRows("workbenchLevel", data.workbenchLevels);
			addRows("itemCount", data.itemCounts);
			addRows("selection", data.selections);
			addRows("stringValue", data.stringValues);
			addRows("numberValue", data.numberValues);

			if (data.activeQuests && data.activeQuests.length > 0) {
				rows.push(`activeQuests,"activeQuests","${data.activeQuests.join("|")}"`);
			}
			if (data.completedQuests && data.completedQuests.length > 0) {
				rows.push(`completedQuests,"completedQuests","${data.completedQuests.join("|")}"`);
			}

			const blob = new Blob([rows.join("\n")], { type: "text/csv" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `cookie-data-${new Date().toISOString().split("T")[0]}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting to CSV:", error);
		}
	};

	const importFromCSV = async (file: File): Promise<boolean> => {
		try {
			const text = await file.text();
			const lines = text
				.split("\n")
				.slice(1)
				.filter((line) => line.trim());

			const importedData: Partial<CookieData> = {
				workbenchLevels: {},
				activeQuests: [],
				completedQuests: [],
				itemCounts: {},
				selections: {},
				stringValues: {},
				numberValues: {},
			};

			for (const line of lines) {
				const [type, key, value] = line
					.split(",")
					.map((cell) => cell.replace(/^"(.*)"$/, "$1"));

				const categories: Record<string, keyof CookieData> = {
					workbenchLevel: "workbenchLevels",
					itemCount: "itemCounts",
					selection: "selections",
					stringValue: "stringValues",
					numberValue: "numberValues",
				};

				if (type === "activeQuests") {
					importedData.activeQuests = value.split("|");
				} else if (categories[type]) {
					const category = categories[type];
					let parsedValue: any = value;

					if (
						category === "workbenchLevels" ||
						category === "itemCounts" ||
						category === "numberValues"
					) {
						parsedValue = parseInt(value);
					} else if (category === "selections") {
						if (value === "true") parsedValue = true;
						else if (value === "false") parsedValue = false;
						else if (!isNaN(Number(value))) parsedValue = Number(value);
					}

					(importedData[category] as Record<string, any>)[key] = parsedValue;
				}
			}

			importData(importedData);
			return true;
		} catch (error) {
			console.error("Error importing from CSV:", error);
			return false;
		}
	};

	const contextValue: CookieContextType = {
		data,
		resetWorkbenches,
		getWorkbenchLevel,
		setWorkbenchLevel,
		// Quest methods
		getActiveQuests,
		addActiveQuest,
		removeActiveQuest,
		getCompletedQuests,
		addCompletedQuest,
		removeCompletedQuest,
		resetQuests,
		getItemCount,
		getAllItemCounts,
		getItemCountEntries,
		setItemCount,
		incrementItemCount,
		decrementItemCount,
		get,
		set,
		remove,
		clearAll,
		clearAllSiteCookies,
		exportData,
		importData,
		exportToHash,
		importFromHash,
		exportToCSV,
		importFromCSV,
	};

	return <CookieContext.Provider value={contextValue}>{children}</CookieContext.Provider>;
}

export function useCookies() {
	const context = useContext(CookieContext);
	if (context === undefined) {
		throw new Error("useCookies must be used within a CookieProvider");
	}
	return context;
}

export type { CookieData, CookieContextType };
