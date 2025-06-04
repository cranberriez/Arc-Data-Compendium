"use client";

import getItemIcon from "@/components/items/getItemIcon";
import { Workbench } from "@/types";
import Link from "next/link";
import { useWorkshop } from "@/contexts/workshopContext";
import ItemCard from "@/components/items/ItemCard";
import { useItems } from "@/contexts/itemContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, PlusIcon, Trash } from "lucide-react";

export const WorkbenchList = ({ workbenches }: { workbenches: Workbench[] }) => {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,448px),1fr))]">
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
	const isMaxed = curWbTier === workbench.tiers.length;

	return (
		<div className="flex flex-col gap-2 border-2 rounded p-2 min-w-0 w-full">
			<div
				key={workbench.id}
				className="flex flex-col sm:flex-row gap-4 sm:gap-2"
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
				</div>
				<div className="flex w-full sm:max-w-[220px] max-w-full flex-col gap-2">
					<WorkbenchTier
						currentTier={curWbTier}
						baseTier={workbench.baseTier}
						maxTier={workbench.tiers.length}
						workbenchId={workbench.id}
						upgradeWorkbench={upgradeWorkbench}
						downgradeWorkbench={downgradeWorkbench}
					/>
					{!isMaxed && (
						<div className="flex flex-col gap-1 min-h-[128px]">
							{/* <p className="text-gray-500">Upgrade Requirements:</p> */}
							{workbench.tiers[curWbTier].requiredItems.map((req) => (
								<div
									key={req.itemId}
									className="flex items-center gap-2 w-full"
								>
									<span className="text-sm w-4 text-right">{req.count}</span>
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
			<Link
				href={`/workshop/${workbench.id}`}
				className="text-blue-500 hover:underline hidden sm:block"
			>
				Go To Workbench
			</Link>
		</div>
	);
};

export const WorkbenchTier = ({
	currentTier,
	baseTier,
	maxTier,
	workbenchId,
	upgradeWorkbench,
	downgradeWorkbench,
}: {
	currentTier: number;
	baseTier: number;
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
						"flex justify-center border-blue-400 dark:border-blue-400/40 border-dashed group hover:border-accent-foreground dark:hover:border-accent cursor-pointer p-2"
					)}
				>
					<p className="text-blue-400 dark:text-blue-400/60 group-hover:hidden flex items-center gap-1">
						<PlusIcon
							size={16}
							className="mt-1"
						/>
						<span>Not Built</span>
					</p>
					<p className="hidden group-hover:flex text-primary/80 dark:text-primary/80 items-center gap-1">
						<PlusIcon
							size={16}
							className="mt-1"
						/>
						<span>Click to build</span>
					</p>
				</div>
			);
		case currentTier === maxTier:
			return (
				<>
					<div
						className={cn(genericClasses, "flex items-center justify-center border-0")}
					>
						<Button
							variant="ghost"
							onClick={() => downgradeWorkbench(workbenchId)}
							className="cursor-pointer"
							disabled={currentTier !== maxTier}
						>
							<MoveLeft />
						</Button>
						<p className="dark:text-green-500 text-green-700 p-2 mb-1">
							Bench Fully Upgraded
						</p>
					</div>
				</>
			);
		default:
			return (
				<div className={cn(genericClasses, "border-transparent flex items-center")}>
					<p className="font-semibold">Level {currentTier}</p>
					<Button
						variant="outline"
						onClick={() => downgradeWorkbench(workbenchId)}
						className="cursor-pointer"
						disabled={currentTier === baseTier}
					>
						{currentTier === baseTier ? <Trash /> : <MoveLeft />}
					</Button>
					<Button
						variant="outline"
						onClick={() => upgradeWorkbench(workbenchId)}
						className="cursor-pointer"
					>
						<MoveRight />
					</Button>
					<p>
						{currentTier + 1}
						<span className="text-xs text-muted-foreground ml-2">/ {maxTier}</span>
					</p>
				</div>
			);
	}
};
