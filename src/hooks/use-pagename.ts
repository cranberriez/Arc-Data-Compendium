"use client";

import { usePathname } from "next/navigation";

export function usePageName() {
	const pathname = usePathname();
	const path = pathname.split("/");
	const pageTitle = path[path.length - 1]
		.replace("-", " ")
		.replace("/", "")
		.replace(/^(.)/, (match) => match.toUpperCase());
	return pageTitle;
}

export function useIsPageName(pageName: string) {
	const pathname = usePathname();
	const path = pathname.split("/");
	return path[path.length - 1] === pageName;
}
