"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { RefreshCwIcon } from "lucide-react";
import { useItems } from "@/contexts/itemContext";
import { useIsPageName } from "@/hooks/use-pagename";

export default function Tools({ setSearchOpen }: { setSearchOpen: (open: boolean) => void }) {
	const { resetFilters, filterState } = useItems();

	const onItemsPage = useIsPageName("items");

	// Check if any filters are currently active
	const hasActiveFilters =
		filterState.searchQuery !== "" ||
		filterState.rarities.length > 0 ||
		filterState.categories.length > 0;

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="sm"
				aria-label="Search"
				className="cursor-pointer"
				onClick={() => setSearchOpen(true)}
			>
				<SearchIcon />
				<p>Search</p>
			</Button>

			{hasActiveFilters && onItemsPage && (
				<Button
					variant="ghost"
					size="icon"
					aria-label="Clear filters"
					onClick={() => resetFilters()}
					className="relative cursor-pointer"
				>
					<RefreshCwIcon />
					<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
				</Button>
			)}
		</div>
	);
}
