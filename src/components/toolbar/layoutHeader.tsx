"use client";

import ToolbarZustand from "./toolbar-zustand";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function LayoutHeader() {
	const { isMobile } = useSidebar();

	return (
		<header
			className={cn(
				"w-full absolute top-0 z-20 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background/25 backdrop-blur-lg",
				!isMobile ? " rounded-xl" : ""
			)}
		>
			<ToolbarZustand />
		</header>
	);
}
