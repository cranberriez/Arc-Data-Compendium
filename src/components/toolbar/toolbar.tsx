"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import ToolbarBreadcrumb from "./tbBreadcrumb";
import Tools from "./tbTools";
import { useState } from "react";
import { useItems } from "@/contexts/itemContext";
import { usePageName } from "@/hooks/use-pagename";
import { SearchDialog } from "./search-dialog";
import ToolbarItemCount from "./tbItemCount";

export default function Toolbar() {
	const [searchOpen, setSearchOpen] = useState(false);
	const { allItems } = useItems();
	const pageTitle = usePageName();

	return (
		<>
			<div className="flex items-center justify-between gap-2 px-4 w-full">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="-ml-1 cursor-pointer" />
					<ToolbarBreadcrumb />
				</div>
				<Tools setSearchOpen={setSearchOpen} />

				<ToolbarItemCount initialCount={allItems.length} />
			</div>

			<SearchDialog
				open={searchOpen}
				onOpenChange={setSearchOpen}
				allItems={allItems}
				showCategories={pageTitle.toLowerCase() === "items"}
			/>
		</>
	);
}
