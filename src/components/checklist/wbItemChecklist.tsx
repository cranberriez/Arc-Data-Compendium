"use client";

import { useWorkshop } from "@/contexts/workshopContext";
import { useItems } from "@/contexts/itemContext";
import { InfoIcon } from "lucide-react";
import { ItemChecklistSkeleton } from "./checklistItem";
import { ChecklistItem } from "./checklistItem";

export const WorkshopItemChecklist = () => {
	const { loading, workbenchUpgradeSummary } = useWorkshop();
	const { getItemById } = useItems();
	const summary = workbenchUpgradeSummary;

	return (
		<div className="flex flex-col gap-4 border-2 rounded p-2 w-full h-fit xl:w-fit xl:h-full">
			<h2 className="text-lg font-semibold text-center">Workbench Upgrade Items</h2>
			<div>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-1rem justify-items-center">
					{loading
						? Array.from({ length: 12 }).map((_, idx) => (
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
			<div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 p-2 rounded dark:text-amber-200 text-cyan-600">
				<InfoIcon size={16} className="min-w-8" />
				<h3 className="text-sm lg:max-w-[260px]">
					Pin Workbench levels in game for live item counters!
				</h3>
			</div>
		</div>
	);
};
