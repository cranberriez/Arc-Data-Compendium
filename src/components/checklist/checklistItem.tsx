import { Item, WorkbenchUpgradeSummary, WorkbenchUpgradeSummaryItem } from "@/types";
import { Skeleton } from "../ui/skeleton";
import ItemCard from "../items/ItemCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { formatName } from "@/utils/format";

export const ItemChecklistSkeleton = () => {
	return (
		<div
			className="flex items-center gap-2 mb-2 w-xs"
			style={{ breakInside: "avoid-column" }}
		>
			<Skeleton className="min-w-8 h-8" />
			<Skeleton className="flex-1 h-8" />
		</div>
	);
};

export const ChecklistItem = ({
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
