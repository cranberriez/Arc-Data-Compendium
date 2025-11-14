"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatName } from "@/utils/items/itemUtils";
import { WorkbenchRequirement } from "@/utils/workbenchUtils";
import { useDialog } from "@/hooks/useUI";
import { useItems } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";
import ItemImage from "@/components/items/ItemImage";

export function WorkbenchItemReqTable({
	requirements,
	totalTiers,
	highlightTier,
}: {
	requirements: WorkbenchRequirement[];
	totalTiers: number;
	highlightTier?: number;
}) {
	const { openDialog } = useDialog();
	const { isLoading, getItemById } = useItems();

	return (
		<Table className="text-xs lg:text-lg h-full table-fixed sm:table-auto">
			<TableHeader>
				<TableRow>
					<TableHead className="w-10"></TableHead>
					<TableHead>Item</TableHead>
					{Array.from({ length: totalTiers }).map((_, i) => {
						const isCurTier = highlightTier === i + 1;
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
				{requirements.map((requirement) => {
					const item = getItemById(requirement.itemId);
					return (
						<TableRow
							key={requirement.itemId}
							className="cursor-pointer border-0"
							onClick={() => openDialog("item", item)}
						>
							<TableCell className="text-center align-middle p-0">
								{item && !isLoading ? (
									<ItemImage item={item} expectedSize={24} />
								) : isLoading ? (
									<Skeleton className="w-6 h-6 mx-auto" />
								) : null}
							</TableCell>
							<TableCell className="font-medium sm:pr-6 truncate sm:max-w-60">
								{formatName(requirement.itemId)}
							</TableCell>
							{Array.from({ length: totalTiers }).map((_, i) => {
								const tier = i + 1;
								const count = requirement.perTier[tier] || 0;
								const isCurTier = highlightTier === tier;
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
