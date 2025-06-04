"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { useRecipes } from "@/contexts/recipeContext";
import { Workbench } from "@/types";
import getItemIcon from "@/components/items/getItemIcon";
import { WorkbenchUpgrades } from "@/components/workbench/workbenchUpgrade";
import { useWorkshop } from "@/contexts/workshopContext";
import WorkbenchTiers from "./workbenchTiers";

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	const { workbenchUserData, upgradeWorkbench, downgradeWorkbench } = useWorkshop();
	const icon = getItemIcon(workbench.icon);

	// Calculate derived values
	const curWbTier =
		workbenchUserData.find((wb) => wb.workbenchId === workbench.id)?.currentTier ??
		workbench.baseTier;
	const isMaxed = curWbTier === workbench.tiers.length;

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<div className="flex flex-col justify-between gap-8">
					{/* Gradient header with icon */}
					<div>
						<div className="flex items-center gap-4">
							<div className="flex-shrink-0 bg-blue-400 dark:bg-teal-300 text-secondary rounded-lg p-2 w-16 h-16">
								{React.cloneElement(icon, {
									className: "w-full h-full",
								})}
							</div>
							<div>
								<h1 className="text-3xl font-extrabold">{workbench.name}</h1>
								<h2 className="hidden sm:block text-lg font-medium mt-1">
									{workbench.description}
								</h2>
							</div>
						</div>
						<h2 className="block sm:hidden text-lg font-medium mt-1">
							{workbench.description}
						</h2>
					</div>
					{workbench.id !== "basic_bench" && (
						<div className="min-h-[240px] w-sm p-2 border-1 bg-background rounded-lg flex flex-col">
							<WorkbenchUpgrades
								curWbTier={curWbTier}
								workbench={workbench}
								upgradeWorkbench={upgradeWorkbench}
								downgradeWorkbench={downgradeWorkbench}
								isMaxed={isMaxed}
								className="w-full sm:max-w-full flex-col-reverse justify-between flex-1"
							/>
						</div>
					)}
				</div>
			</Card>

			<WorkbenchTiers
				workbench={workbench}
				curWbTier={curWbTier}
			/>
		</div>
	);
}
