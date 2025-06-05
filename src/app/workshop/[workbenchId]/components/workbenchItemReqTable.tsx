"use client";

import getItemIcon from "@/components/items/getItemIcon";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getRarityColor, formatName } from "@/data/items/itemUtils";
import { WorkbenchRequirement } from "@/data/workbenches/workbenchUtils";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkbenchItemReqTable({
	allRequirements,
	totalTiers,
	curWbTier,
}: {
	allRequirements: WorkbenchRequirement[];
	totalTiers: number;
	curWbTier: number;
}) {
	const { openDialog } = useDialog();
	const { isLoading, getItemById } = useItems();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-10"></TableHead>
					<TableHead className="w-1/4">Item</TableHead>
					{Array.from({ length: totalTiers }).map((_, i) => {
						const isCurTier = curWbTier === i + 1;
						return (
							<TableHead
								key={i}
								className={["text-center", isCurTier && "bg-blue-500/10"]
									.filter(Boolean)
									.join(" ")}
							>
								Tier {i + 1}
							</TableHead>
						);
					})}
					<TableHead className="text-center bg-sidebar dark:bg-card!">Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{allRequirements.map((requirement) => {
					const item = getItemById(requirement.itemId);
					return (
						<TableRow
							key={requirement.itemId}
							className="cursor-pointer border-0"
							onClick={() => openDialog("item", item)}
						>
							<TableCell className="text-center align-middle">
								{item && !isLoading ? (
									getItemIcon(
										item.icon,
										`w-6 h-6 mx-auto ${getRarityColor(item.rarity, "text")}`
									)
								) : isLoading ? (
									<Skeleton className="w-6 h-6 mx-auto" />
								) : null}
							</TableCell>
							<TableCell className="font-medium">
								{formatName(requirement.itemId)}
							</TableCell>
							{Array.from({ length: totalTiers }).map((_, i) => {
								const tier = i + 1;
								const count = requirement.perTier[tier] || 0;
								const isCurTier = curWbTier === tier;
								return (
									<TableCell
										key={tier}
										className={[
											"text-center font-mono",
											isCurTier &&
												"bg-blue-500/10 group-hover/row:bg-blue-500/20",
										]
											.filter(Boolean)
											.join(" ")}
									>
										{count > 0 ? count : ""}
									</TableCell>
								);
							})}
							<TableCell className="text-center font-bold bg-sidebar dark:bg-card">
								{requirement.totalCount}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
