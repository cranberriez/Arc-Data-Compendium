"use client";

import { useWorkshop } from "@/contexts/workshopContext";
import { useItems } from "@/contexts/itemContext";
import ItemCard from "../items/ItemCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatName } from "@/data/items/itemUtils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItemChecklist() {
	return (
		<div>
			<WorkshopItemChecklist />
		</div>
	);
}

const WorkshopItemChecklist = () => {
	const { loading: wbLoading, getWorkbenchUpgradeSummary } = useWorkshop();
	const { getItemById } = useItems();
	const summary = getWorkbenchUpgradeSummary();

	return (
		<div>
			<h2>Item Checklist</h2>
			<div className="flex flex-col items-start relative">
				{true ? (
					<>
						{[...Array(8)].map((_, i) => (
							<Skeleton
								key={i}
								className="w-64 h-8 my-1"
							/>
						))}
					</>
				) : (
					Object.entries(summary).map(([itemId, itemSummary]) => {
						const item = getItemById(itemId);
						return (
							<HoverCard key={itemId}>
								<HoverCardTrigger asChild>
									<div>
										<ItemCard
											item={item}
											variant="icon"
											count={itemSummary.count}
											orientation="horizontal"
											showBorder={false}
											size="sm"
										/>
									</div>
								</HoverCardTrigger>
								<HoverCardContent side="right">
									<div className="flex flex-col gap-2">
										<p>Used In:</p>
										<ul className="pl-2 flex flex-col gap-1">
											{itemSummary.usedIn.map((workbench) => {
												return (
													<li
														key={workbench.workbenchId}
														className="flex gap-2 items-center"
													>
														<span>{workbench.targetTier}</span>
														<span className="font-mono">
															{formatName(workbench.workbenchId)}
														</span>
													</li>
												);
											})}
										</ul>
									</div>
								</HoverCardContent>
							</HoverCard>
						);
					})
				)}
			</div>
		</div>
	);
};
