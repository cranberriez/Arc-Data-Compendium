"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { Workbench } from "@/types";
import getItemIcon from "@/components/items/getItemIcon";
import { useWorkshop } from "@/contexts/workshopContext";
import WorkbenchTiers from "./workbenchTiers";
import { WorkbenchUpgradeReqs } from "./workbenchUpgrade";
import { Button } from "@/components/ui/button";
import { Image, MoveLeft, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	const { getLevel, upgradeWorkbench, downgradeWorkbench } = useWorkshop();

	// Calculate derived values
	const curWbTier = getLevel(workbench.id);
	const isMaxed = curWbTier === workbench.tiers.length;
	const icon = getItemIcon(workbench.icon);

	return (
		<div className="space-y-6">
			<Card className="p-6 flex flex-wrap flex-row justify-between">
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
					<div className="flex items-center justify-between gap-4">
						<Button
							variant="outline"
							disabled={curWbTier === 0}
							aria-label="Downgrade"
							onClick={() => downgradeWorkbench(workbench.id)}
							className={cn("cursor-pointer")}
						>
							<MoveLeft className="size-6" />
						</Button>
						<h3 className="text-center text-2xl font-semibold text-muted-foreground font-mono">
							Level <span className="font-semibold text-primary">{curWbTier}</span>
						</h3>
						<Button
							variant="outline"
							disabled={isMaxed}
							aria-label="Upgrade"
							onClick={() => upgradeWorkbench(workbench.id)}
							className="cursor-pointer"
						>
							<MoveRight className="size-6" />
						</Button>
					</div>
				</div>

				<div className="flex flex-row flex-wrap justify-start gap-2">
					{workbench.baseTier !== workbench.tiers.length && (
						<div className="flex flex-col gap-2 border-2 border-blue-500 rounded-lg p-2 px-6 w-[320px]">
							<h3 className="text-center text-lg font-semibold">
								Upgrade Requirements
							</h3>
							{!isMaxed ? (
								<WorkbenchUpgradeReqs
									tiers={workbench.tiers}
									curWbTier={curWbTier}
								/>
							) : (
								<div className="flex items-center justify-center min-h-[128px] text-muted-foreground">
									No Requirements
								</div>
							)}
						</div>
					)}
					<div className="flex justify-center items-center bg-background border-2 rounded-lg w-2xs text-muted-foreground">
						<Image />
					</div>
				</div>
			</Card>

			<WorkbenchTiers
				workbenchId={workbench.id}
				recipes={workbench.workbenchRecipes}
				tiers={workbench.tiers}
				curWbTier={curWbTier}
			/>
		</div>
	);
}
