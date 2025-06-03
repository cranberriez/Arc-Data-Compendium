"use client";

import getItemIcon from "@/components/items/getItemIcon";
import { Workbench } from "@/types";
import Link from "next/link";
import { useWorkshop } from "@/contexts/workshopContext";
import ItemCard from "@/components/items/ItemCard";
import { useItems } from "@/contexts/itemContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const WorkbenchList = ({ workbenches }: { workbenches: Workbench[] }) => {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(448px,1fr))]">
			{workbenches.map((workbench) => (
				<WorkbenchPreview
					key={workbench.id}
					workbench={workbench}
				/>
			))}
		</div>
	);
};

export const WorkbenchPreview = ({ workbench }: { workbench: Workbench }) => {
	const icon = getItemIcon(workbench.icon);
	const { workbenchUserData, upgradeWorkbench, downgradeWorkbench } = useWorkshop();
	const { isLoading: itemsLoading, getItemById } = useItems();
	const curWbTier =
		workbenchUserData.find((wb) => wb.workbenchId === workbench.id)?.currentTier ??
		workbench.baseTier;

	return (
		<div
			key={workbench.id}
			className="flex border-2 rounded p-2 min-w-md"
		>
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex flex-col flex-1 gap-2">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 p-2 flex items-center justify-center rounded bg-muted">
							{icon}
						</div>
						<h2 className="text-xl font-semibold mb-1">{workbench.name}</h2>
					</div>
					<p className="text-gray-500 ">{workbench.description}</p>
				</div>
				<Link
					href={`/workshop/${workbench.id}`}
					className="text-blue-500 hover:underline"
				>
					Go To Workbench
				</Link>
			</div>
			<div className="flex w-[220px] flex-col gap-2 mx-2">
				<WorkbenchTier
					currentTier={curWbTier}
					maxTier={workbench.tiers.length}
					workbenchId={workbench.id}
					upgradeWorkbench={upgradeWorkbench}
					downgradeWorkbench={downgradeWorkbench}
				/>
				{curWbTier !== workbench.tiers.length && (
					<div className="flex flex-col gap-1">
						<p className="text-gray-500">Upgrade Requirements:</p>
						{workbench.tiers[curWbTier].requiredItems.map((req) => (
							<div
								key={req.itemId}
								className="flex items-center gap-2 w-full"
							>
								<span className="text-sm w-4">{req.count}</span>
								{itemsLoading ? (
									<>
										<Skeleton className="min-w-10 h-10" />
										<Skeleton className="w-full h-10" />
									</>
								) : (
									<ItemCard
										item={getItemById(req.itemId)}
										variant="icon"
										orientation="horizontal"
										size="sm"
										showBorder={false}
										className="w-full"
									/>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export const WorkbenchTier = ({
	currentTier,
	maxTier,
	workbenchId,
	upgradeWorkbench,
	downgradeWorkbench,
}: {
	currentTier: number;
	maxTier: number;
	workbenchId: string;
	upgradeWorkbench: (workbenchId: string) => void;
	downgradeWorkbench: (workbenchId: string) => void;
}) => {
	const genericClasses = "flex items-center justify-between gap-2 bg-background rounded border-2";

	switch (true) {
		case currentTier === 0:
			return (
				<div
					onClick={() => upgradeWorkbench(workbenchId)}
					className={cn(
						genericClasses,
						"border-red-400/40 border-dashed group hover:border-accent transition-colors cursor-pointer px-2"
					)}
				>
					<p className="text-red-400/60 group-hover:hidden">Not Built</p>
					<p className="hidden group-hover:block text-primary/80">Click to build</p>
				</div>
			);
		case currentTier === maxTier:
			return (
				<div className={cn(genericClasses, "border-green-500/40")}>
					<p className="text-green-500 px-2">Bench Fully Upgraded</p>
				</div>
			);
		default:
			return (
				<div className={cn(genericClasses, "border-transparent")}>
					<p>Level {currentTier}</p>
					<p className="text-xs text-muted-foreground">max {maxTier}</p>
				</div>
			);
	}
};
