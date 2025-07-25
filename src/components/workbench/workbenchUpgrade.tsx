import { Check, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Item, Tier, Workbench } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/items/ItemCard";
import { useItems } from "@/contexts/itemContext";

export const WorkbenchUpgrades = ({
	curWbTier,
	workbench,
	upgradeWorkbench,
	downgradeWorkbench,
	isMaxed,
	className,
}: {
	curWbTier: number;
	workbench: Workbench;
	upgradeWorkbench: (workbenchId: string) => void;
	downgradeWorkbench: (workbenchId: string) => void;
	isMaxed: boolean;
	className?: string;
}) => {
	return (
		<div className={cn("flex w-full max-w-full sm:max-w-[220px] flex-col gap-2", className)}>
			<WorkbenchTier
				currentTier={curWbTier}
				baseTier={workbench.baseTier}
				maxTier={workbench.tiers.length}
				workbenchId={workbench.id}
				upgradeWorkbench={upgradeWorkbench}
				downgradeWorkbench={downgradeWorkbench}
			/>
			{!isMaxed && (
				<WorkbenchUpgradeReqs
					tiers={workbench.tiers}
					curWbTier={curWbTier}
				/>
			)}
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
	const genericClasses = "flex items-center justify-between gap-2 h-11";

	switch (true) {
		case currentTier === 0:
			return (
				<div
					onClick={() => upgradeWorkbench(workbenchId)}
					className={cn(
						genericClasses,
						"flex justify-center border-blue-400 dark:border-blue-400/40 border-dashed group hover:border-accent-foreground dark:hover:border-accent cursor-pointer p-2 rounded border-2"
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
					<div className={cn(genericClasses)}>
						<Button
							variant="ghost"
							onClick={() => downgradeWorkbench(workbenchId)}
							className="cursor-pointer"
							disabled={currentTier === baseTier}
						>
							{currentTier === baseTier ? <Trash /> : <MoveLeft />}
						</Button>
						<p className="dark:text-green-500 text-green-700 p-2 mb-1">Max Level</p>
						<Button
							variant="ghost"
							disabled
						>
							<Check />
						</Button>
					</div>
				</>
			);
		default:
			return (
				<div className={cn(genericClasses)}>
					<Button
						variant="outline"
						onClick={() => downgradeWorkbench(workbenchId)}
						className="cursor-pointer"
						disabled={currentTier === baseTier}
					>
						{currentTier === baseTier ? <Trash /> : <MoveLeft />}
					</Button>
					<p className="font-semibold">
						Level <span className="font-mono">{currentTier}</span>
					</p>
					<Button
						variant="outline"
						onClick={() => upgradeWorkbench(workbenchId)}
						className="cursor-pointer"
					>
						<MoveRight />
					</Button>
				</div>
			);
	}
};

export const WorkbenchUpgradeReqs = ({
	tiers,
	curWbTier,
}: {
	tiers: Tier[];
	curWbTier: number;
}) => {
	const { isLoading: itemsLoading, getItemById } = useItems();

	return (
		<div className="flex flex-col gap-1 min-h-[128px]">
			{tiers[curWbTier].requirements.map((req) => (
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
	);
};
