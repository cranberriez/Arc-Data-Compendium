"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { Workbench } from "@/types";
import getItemIcon from "@/components/items/getItemIcon";
import { useWorkshop } from "@/contexts/workshopContext";
import WorkbenchTiers from "./workbenchTiers";

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	const { getLevel } = useWorkshop();

	// Calculate derived values
	const curWbTier = getLevel(workbench.id);
	const isMaxed = curWbTier === workbench.tiers.length;
	const icon = getItemIcon(workbench.icon);

	return (
		<div className="space-y-6">
			<Card className="p-6 flex flex-wrap flex-row">
				<div className="flex flex-col justify-between gap-8">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-4">
							<div className="flex-shrink-0 bg-blue-400 dark:bg-blue-500 text-card rounded-lg p-2 w-16 h-16">
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
				</div>
				<div className="ml-auto">Upgrade menu goes here</div>
				<div>Items to upgrade from current level here</div>
			</Card>

			<WorkbenchTiers
				workbench={workbench}
				curWbTier={curWbTier}
			/>
		</div>
	);
}
