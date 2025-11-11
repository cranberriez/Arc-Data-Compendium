"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useItems } from "@/hooks/useData";
import { usePageName } from "@/hooks/use-pagename";
import { SearchDialog } from "./search-dialog";
import ToolbarItemCount from "./tbItemCount";
import Tools from "./tbTools";

export default function ToolbarZustand() {
	const [searchOpen, setSearchOpen] = useState(false);
	const { items } = useItems(); // Much simpler than useItems context
	const pageTitle = usePageName();

	return (
		<div className="grid grid-cols-[2fr_1fr_2fr] items-center justify-between gap-2 px-4 w-full">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-2 cursor-pointer" />
				{/* <ToolbarBreadcrumb /> */}
			</div>

			<Tools setSearchOpen={setSearchOpen} className="justify-self-center" />
			<ToolbarItemCount initialCount={items.length} className="justify-self-end" />

			<SearchDialog open={searchOpen} onOpenChange={setSearchOpen} allItems={items} />
		</div>
	);
}
