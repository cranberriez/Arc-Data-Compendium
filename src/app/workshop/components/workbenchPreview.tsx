"use client";

import getItemIcon from "@/components/items/getItemIcon";
import { Workbench } from "@/types";
import Link from "next/link";
import { useWorkshop } from "@/contexts/workshopContext";
import { useItems } from "@/contexts/itemContext";
import { WorkbenchUpgrades } from "@/components/workbench/workbenchUpgrade";

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
				<WorkbenchUpgrades
					curWbTier={curWbTier}
					workbench={workbench}
					upgradeWorkbench={upgradeWorkbench}
					downgradeWorkbench={downgradeWorkbench}
					isMaxed={isMaxed}
				/>
			</div>
			<Link
				href={`/workshop/${workbench.id}`}
				className="text-blue-500 hover:underline"
			>
				Go To Workbench
			</Link>
		</div>
	);
};
