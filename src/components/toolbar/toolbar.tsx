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
			<div className="grid grid-cols-[2fr_1fr_2fr] items-center justify-between gap-2 px-4 w-full">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="-ml-2 cursor-pointer" />
					<ToolbarBreadcrumb />
				</div>
				<Tools
					setSearchOpen={setSearchOpen}
					className="justify-self-center"
				/>

				<ToolbarItemCount
					initialCount={allItems.length}
					className="justify-self-end"
				/>
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
