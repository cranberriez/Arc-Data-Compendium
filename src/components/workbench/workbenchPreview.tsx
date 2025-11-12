"use client";

import getItemIcon from "@/components/items/getItemIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Workbench } from "@/types";
import Link from "next/link";
import { WorkbenchUpgrades } from "@/components/workbench/workbenchUpgrade";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useWorkbenchLevels } from "@/hooks/useUser";

export const WorkbenchPreview = ({ workbench }: { workbench: Workbench }) => {
	if (!workbench) {
		return <LoadingWorkbenchPreview />;
	}

	const { getWorkbenchLevel, setWorkbenchLevel } = useWorkbenchLevels();

	let curWbTier = getWorkbenchLevel(workbench.id) || workbench.baseTier;

	const upgradeWorkbench = () => {
		setWorkbenchLevel(workbench.id, curWbTier + 1);
	};

	const downgradeWorkbench = () => {
		setWorkbenchLevel(workbench.id, curWbTier - 1);
	};

	const icon = getItemIcon(workbench.icon);
	const isMaxed = curWbTier === workbench.tiers.length;

	return (
		<div className="flex flex-col justify-between gap-2 border-2 rounded-lg p-2 sm:p-4 min-w-0 w-full min-h-60 sm:h-64 bg-card">
			<div key={workbench.id} className="flex flex-col sm:flex-row gap-4 sm:gap-2 h-full">
				<div className="flex flex-col flex-1 gap-2">
					<div className="flex items-center gap-2 h-11">
						<div className="w-10 h-10 p-2 flex items-center justify-center rounded bg-muted">
							{icon}
						</div>
						<h2 className="text-xl font-semibold mb-1">{workbench.name}</h2>
					</div>
					<p className="text-gray-500 ">{workbench.description}</p>
				</div>

				<WorkbenchUpgrades
					curWbTier={curWbTier}
					workbench={workbench}
					upgradeWorkbench={upgradeWorkbench}
					downgradeWorkbench={downgradeWorkbench}
					isMaxed={isMaxed}
				/>
			</div>
			<Button variant="link" className="w-fit self-start" asChild>
				<Link href={`/workshop/${workbench.id}`}>
					<FileText className="h-4 w-4" />
					Details
				</Link>
			</Button>
		</div>
	);
};

const LoadingWorkbenchPreview = () => {
	return (
		<div className="flex flex-col gap-2 border-2 rounded p-2 min-w-0 w-full h-60 animate-pulse">
			<div className="flex flex-1 flex-col sm:flex-row gap-4 sm:gap-2">
				<div className="flex flex-col gap-2 flex-1">
					<div className="flex flex-col flex-1 gap-2">
						<div className="flex items-center gap-2 h-11">
							<div className="w-10 h-10 p-2 flex items-center justify-center rounded bg-muted">
								<Skeleton className="w-6 h-6 rounded-full" />
							</div>
							<Skeleton className="h-6 w-32" />
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
				{/* Upgrades Skeleton */}
				<div className="flex flex-col gap-2 w-40">
					<Skeleton className="h-6 w-24 mb-2" />
					<Skeleton className="h-4 w-32 mb-1" />
					<Skeleton className="h-4 w-20" />
				</div>
			</div>
			<Skeleton className="h-6 w-32 mt-2" />
		</div>
	);
};
