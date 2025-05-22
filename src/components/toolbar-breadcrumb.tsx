"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { useItems } from "@/contexts/itemContext";
import { SearchDialog } from "./search-dialog";

export function ToolbarBreadcrumb() {
	const pathname = usePathname();
	const path = pathname.split("/");
	const pageTitle = path[path.length - 1]
		.replace("-", " ")
		.replace("/", "")
		.replace(/^(.)/, (match) => match.toUpperCase());

	const [searchOpen, setSearchOpen] = useState(false);
	const { resetFilters, filterState, filteredItems, allItems } = useItems();

	// Check if any filters are currently active
	const hasActiveFilters =
		filterState.searchQuery !== "" ||
		filterState.rarities.length > 0 ||
		filterState.categories.length > 0;

	return (
		<div className="flex items-center justify-between w-full">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink href="/">ARC Data</BreadcrumbLink>
					</BreadcrumbItem>
					{pageTitle !== "" && (
						<>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center ml-auto gap-1">
				{pageTitle.toLowerCase() === "items" && (
					<p className="text-sm text-muted-foreground ml-4">
						Viewing {filteredItems.length} items
					</p>
				)}

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="icon"
						aria-label="Clear filters"
						onClick={() => resetFilters()}
						className="relative"
					>
						<RefreshCwIcon />
						<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
					</Button>
				)}

				<Button
					variant="ghost"
					size="icon"
					aria-label="Search"
					onClick={() => setSearchOpen(true)}
				>
					<SearchIcon />
				</Button>
			</div>

			<SearchDialog
				open={searchOpen}
				onOpenChange={setSearchOpen}
				allItems={allItems}
				showCategories={pageTitle.toLowerCase() === "items"}
			/>
		</div>
	);
}
