/**
 * Utility functions for handling browser cookies
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
	return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
	if (typeof document === "undefined") return;

	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, days = 365): void {
	if (typeof document === "undefined") return;

	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}

	document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

/**
 * Get workbench data from cookies
 */
export function getWorkbenchData(workbenchId: string): WorkbenchUserData | null {
	try {
		const data = getCookie(`workbench_${workbenchId}`);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error("Error parsing workbench data:", error);
		return null;
	}
}

/**
 * Save workbench data to cookies
 */
export function saveWorkbenchData(data: WorkbenchUserData): void {
	try {
		setCookie(`workbench_${data.workbenchId}`, JSON.stringify(data));
	} catch (error) {
		console.error("Error saving workbench data:", error);
	}
}

/**
 * Clear all workbench cookies
 */
export function clearAllWorkbenchCookies(): void {
	if (typeof document === "undefined") return;

	// Get all cookies
	const cookies = document.cookie.split(";");

	// Delete cookies that start with 'workbench_'
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith("workbench_")) {
			const cookieName = cookie.split("=")[0];
			deleteCookie(cookieName);
		}
	}
}

// Re-export the type for convenience
export interface WorkbenchUserData {
	workbenchId: string;
	currentTier: number;
}
