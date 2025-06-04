"use client";

import { useWorkshop } from "@/contexts/workshopContext";
import { useItems } from "@/contexts/itemContext";
import ItemCard from "../items/ItemCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatName } from "@/data/items/itemUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";
import { Item, WorkbenchUpgradeSummary, WorkbenchUpgradeSummaryItem } from "@/types";

export default function ItemChecklist() {
	return (
		<div>
			<WorkshopItemChecklist />
		</div>
	);
}

const WorkshopItemChecklist = () => {
	const { loading: wbLoading, workbenchUpgradeSummary } = useWorkshop();
	const { getItemById } = useItems();
	const summary = workbenchUpgradeSummary;

	return (
		<div className="flex flex-col gap-4 border-2 rounded p-2 w-full">
			<h2 className="text-lg font-semibold text-center">Workbench Item Checklist</h2>
			<p className="text-center text-muted-foreground">
				{wbLoading ? "Loading..." : "Click an Item to view details about source and uses."}
			</p>
			<div>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-1rem justify-items-center">
					{false
						? Array.from({ length: 16 }).map((_, idx) => (
								<ItemChecklistSkeleton key={idx} />
						  ))
						: Object.entries(summary)
								.sort((a, b) => b[1].count - a[1].count)
								.map(([itemId, itemSummary]) => {
									const item = getItemById(itemId);
									if (!item) return null;

									return (
										<ChecklistItem
											key={itemId}
											item={item}
											itemSummary={itemSummary}
										/>
									);
								})}
				</div>
			</div>
		</div>
	);
};

const ItemChecklistSkeleton = () => {
	return (
		<div
			className="flex items-center gap-2 mb-2 w-xs"
			style={{ breakInside: "avoid-column" }}
		>
			<Skeleton className="w-8 h-8" />
			<Skeleton className="w-8 h-8" />
			<Skeleton className="w-full h-8" />
			<Skeleton className="w-8 h-8" />
		</div>
	);
};

const ChecklistItem = ({
	item,
	itemSummary,
}: {
	item: Item;
	itemSummary: WorkbenchUpgradeSummary;
}) => {
	return (
		<div
			key={item.id}
			className="flex items-center justify-between gap-2 w-xs mb-2"
			style={{ breakInside: "avoid-column" }}
		>
			<div className="flex items-center gap-2">
				<span className="text-md font-semibold w-6 text-right">{itemSummary.count}</span>
			</div>
			<ItemCard
				item={item}
				variant="icon"
				orientation="horizontal"
				showBorder={false}
				size="sm"
			/>
			<HoverCard
				openDelay={50}
				closeDelay={100}
			>
				<HoverCardTrigger>
					<div className="p-2 cursor-pointer ">
						<InfoIcon
							size={16}
							className="text-muted-foreground"
						/>
					</div>
				</HoverCardTrigger>
				<HoverCardContent side="right">
					<div className="flex flex-col gap-2">
						<p>Used In:</p>
						<ul className="pl-2 flex flex-col gap-1">
							{itemSummary.usedIn.map((workbench: WorkbenchUpgradeSummaryItem) => (
								<li
									key={workbench.workbenchId}
									className="flex gap-2 items-center"
								>
									<span>Lvl {workbench.targetTier}</span>
									<span className="font-mono">
										{formatName(workbench.workbenchId)}
									</span>
								</li>
							))}
						</ul>
					</div>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
};
