"use client";

import { useWorkshop } from "@/contexts/workshopContext";
import { useItems } from "@/contexts/itemContext";
import ItemCard from "../items/ItemCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatName } from "@/data/items/itemUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";

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
		<div className="flex flex-col gap-4 border-2 rounded p-2 w-fit">
			<h2 className="text-lg font-semibold text-center">Workbench Item Checklist</h2>
			<div className="flex flex-col items-start relative gap-1">
				{wbLoading ? (
					<>
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-2"
							>
								<Skeleton className="w-8 h-8" />
								<Skeleton className="w-32 h-8" />
								<Skeleton className="w-16 h-8" />
							</div>
						))}
					</>
				) : (
					<div className="flex flex-col gap-1">
						{Object.entries(summary).map(([itemId, itemSummary]) => {
							const item = getItemById(itemId);
							return (
								<div
									key={itemId}
									className="flex items-center justify-between gap-2"
								>
									<ItemCard
										item={item}
										variant="icon"
										orientation="horizontal"
										showBorder={false}
										size="sm"
									/>
									<div className="flex items-center gap-2">
										<span className="text-sm w-4 text-center">0</span>
										<span className="text-xs w-2 text-center text-muted-foreground">
											/
										</span>
										<span className="text-sm w-4 text-center">
											{itemSummary.count}
										</span>
									</div>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon
												size={16}
												className="cursor-pointer text-muted-foreground"
											/>
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
																<span>
																	Lvl {workbench.targetTier}
																</span>
																<span className="font-mono">
																	{formatName(
																		workbench.workbenchId
																	)}
																</span>
															</li>
														);
													})}
												</ul>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
