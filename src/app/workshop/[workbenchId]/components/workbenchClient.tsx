"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { useRecipes } from "@/contexts/recipeContext";
import { Workbench } from "@/types";
import getItemIcon from "@/components/items/getItemIcon";
import { WorkbenchUpgrades } from "@/components/workbench/workbenchUpgrade";
import { useWorkshop } from "@/contexts/workshopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	filterRecipeByWorkbenchTier,
	filterRecipesAvailableByTier,
} from "@/data/recipes/recipeUtils";

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	const { workbenchUserData, upgradeWorkbench, downgradeWorkbench } = useWorkshop();
	const recipes = useRecipes().getRecipesByWorkbench(workbench.id);
	const icon = getItemIcon(workbench.icon);

	// Calculate derived values
	const curWbTier =
		workbenchUserData.find((wb) => wb.workbenchId === workbench.id)?.currentTier ??
		workbench.baseTier;
	const isMaxed = curWbTier === workbench.tiers.length;

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex flex-wrap justify-between gap-8 px-6">
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

					<div className="min-h-[240px] w-sm flex-shrink-1 flex justify-end">
						<WorkbenchUpgrades
							curWbTier={curWbTier}
							workbench={workbench}
							upgradeWorkbench={upgradeWorkbench}
							downgradeWorkbench={downgradeWorkbench}
							isMaxed={isMaxed}
						/>
					</div>
				</div>
			</Card>

			<div className="flex gap-2">
				<Tabs defaultValue="all">
					<div className="flex gap-2">
						<TabsList>
							<TabsTrigger
								value="all"
								className="px-4 cursor-pointer"
							>
								All Recipes
							</TabsTrigger>
							<TabsTrigger
								value="unlocked"
								className="px-4 cursor-pointer"
							>
								Unlocked Recipes
							</TabsTrigger>
						</TabsList>

						<TabsList>
							{workbench.tiers.map((tier, idx) => (
								<TabsTrigger
									key={idx}
									value={`tier-${idx + 1}`}
									className="px-4 cursor-pointer"
								>
									Tier {idx + 1}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{workbench.tiers.map((_, idx) => (
						<TabsContent
							key={idx}
							value={`tier-${idx + 1}`}
						>
							{filterRecipeByWorkbenchTier(recipes, idx + 1).map((recipe) => (
								<div
									key={recipe.id}
									className="flex items-center gap-2"
								>
									{recipe.outputItemId}
								</div>
							))}
						</TabsContent>
					))}

					<TabsContent value="all">
						{recipes.map((recipe) => (
							<div
								key={recipe.id}
								className="flex items-center gap-2"
							>
								{recipe.outputItemId}
							</div>
						))}
					</TabsContent>
					<TabsContent value="unlocked">
						{filterRecipesAvailableByTier(recipes, curWbTier).map((recipe) => (
							<div
								key={recipe.id}
								className="flex items-center gap-2"
							>
								{recipe.outputItemId}
							</div>
						))}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
