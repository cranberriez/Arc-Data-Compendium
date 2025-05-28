"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon, SlidersHorizontal, RefreshCwIcon } from "lucide-react";
import { useItems } from "@/contexts/itemContext";
import { useIsPageName } from "@/hooks/use-pagename";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import FilterSort from "./tbFilterSort";
import { cn } from "@/lib/utils";

export default function Tools({
	setSearchOpen,
	className,
}: {
	setSearchOpen: (open: boolean) => void;
	className?: string;
}) {
	const { resetFilters, filterState, isLoading } = useItems();

	const onItemsPage = useIsPageName("items");

	// Check if any filters are currently active
	const hasActiveFilters =
		filterState.searchQuery !== "" ||
		filterState.rarities.length > 0 ||
		filterState.categories.length > 0;

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<Button
				variant="ghost"
				size="sm"
				aria-label="Search"
				className="cursor-pointer"
				onClick={() => setSearchOpen(true)}
			>
				<SearchIcon />
				<p className="hidden sm:inline">Search</p>
			</Button>

			{onItemsPage && (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							aria-label="Sort & Filter Options"
							className="cursor-pointer"
						>
							<SlidersHorizontal />
							<p className="hidden sm:inline">Options</p>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<FilterSort />
					</PopoverContent>
				</Popover>
			)}

			{onItemsPage && (
				<Button
					variant="ghost"
					size="icon"
					aria-label="Clear filters"
					onClick={hasActiveFilters ? resetFilters : undefined}
					className="relative cursor-pointer"
				>
					<RefreshCwIcon className={isLoading ? "animate-spin" : ""} />
					{hasActiveFilters && (
						<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
					)}
				</Button>
			)}
		</div>
	);
}
