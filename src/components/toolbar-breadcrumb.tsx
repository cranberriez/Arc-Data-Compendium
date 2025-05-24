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
import { useIsMobile } from "@/hooks/use-mobile";

export function ToolbarBreadcrumb() {
	// TODO: Convert to a utility
	const pathname = usePathname();
	const path = pathname.split("/");
	const pageTitle = path[path.length - 1]
		.replace("-", " ")
		.replace("/", "")
		.replace(/^(.)/, (match) => match.toUpperCase());
	const onItemsPage = path[path.length - 1] === "items";

	const [searchOpen, setSearchOpen] = useState(false);
	const { resetFilters, filterState, filteredItems, allItems } = useItems();

	// Check if any filters are currently active
	const hasActiveFilters =
		filterState.searchQuery !== "" ||
		filterState.rarities.length > 0 ||
		filterState.categories.length > 0;

	const isUseMobile = !useIsMobile();

	return (
		<div className="flex items-center justify-between w-full">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink href="/">ARC Vault</BreadcrumbLink>
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

			{isUseMobile && onItemsPage && (
				<div className="flex items-center ml-auto gap-1">
					<p className="text-sm dark:text-red-500 text-red-700">Work In Progress</p>
				</div>
			)}

			<div className="flex items-center ml-auto gap-1">
				{pageTitle.toLowerCase() === "items" && (
					<p className="text-sm text-muted-foreground ml-4">
						Viewing {filteredItems.length} items
					</p>
				)}

				{hasActiveFilters && onItemsPage && (
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
					size="sm"
					aria-label="Search"
					onClick={() => setSearchOpen(true)}
				>
					<SearchIcon />
					<p>Search</p>
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
