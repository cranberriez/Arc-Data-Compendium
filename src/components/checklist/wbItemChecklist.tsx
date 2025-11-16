"use client";

import { useItems, useWorkbenches } from "@/hooks/useData";
import { useWorkbenchLevels } from "@/hooks/useUser";
import { useMemo } from "react";
import { InfoIcon } from "lucide-react";
import { ItemChecklistSkeleton } from "./checklistItem";
import { ChecklistItem } from "./checklistItem";

export const WorkshopItemChecklist = () => {
	const { workbenches, isLoading } = useWorkbenches();
	const { getItemById } = useItems();
	const { workbenchLevels, getWorkbenchLevel, hasHydrated } = useWorkbenchLevels();

	const loading = isLoading || !hasHydrated;

	const summary = useMemo(() => {
		const map: Record<
			string,
			{ count: number; usedIn: { workbenchId: string; targetTier: number }[] }
		> = {};
		for (const wb of workbenches) {
			const current = getWorkbenchLevel(wb.id) ?? 0;
			const targetTier = current + 1;
			const tier = wb.tiers?.find((t) => t.tier === targetTier);
			if (!tier || !tier.requirements) continue;
			for (const req of tier.requirements) {
				if (!map[req.itemId]) {
					map[req.itemId] = { count: 0, usedIn: [] };
				}
				map[req.itemId].count += req.count;
				map[req.itemId].usedIn.push({ workbenchId: wb.id, targetTier });
			}
		}
		return map;
	}, [workbenches, workbenchLevels, getWorkbenchLevel]);

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
