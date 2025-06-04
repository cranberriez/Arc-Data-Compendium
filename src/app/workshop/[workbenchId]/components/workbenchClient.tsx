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
import { Book, BookOpen, Boxes } from "lucide-react";

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

	// --- Tabs state and helpers ---
	const [mode, setMode] = React.useState<"recipes" | "requirements">("recipes");
	const [selectedTier, setSelectedTier] = React.useState<number | "all">("all");
	const tabValue = `${mode}-${selectedTier}`;

	const tabClasses = "px-4 py-2 cursor-pointer";

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
				</div>
			</Card>

			<div className="flex gap-2 p-6 border-2 bg-card rounded-lg relative mt-18">
				{/* Mode and Tier Tabs */}

				<Tabs value={tabValue}>
					<TabsList className="absolute -top-12 left-6">
						<TabsTrigger
							value={`recipes-${selectedTier}`}
							onClick={() => setMode("recipes")}
							className={tabClasses}
						>
							<Book />
							Recipes
						</TabsTrigger>
						<TabsTrigger
							value={`requirements-${selectedTier}`}
							onClick={() => setMode("requirements")}
							className={tabClasses}
						>
							<Boxes />
							Requirements
						</TabsTrigger>
					</TabsList>
					<TabsList>
						<TabsTrigger
							value="all"
							onClick={() => setSelectedTier("all")}
							className={tabClasses}
						>
							All
						</TabsTrigger>
						{workbench.tiers.map((_, idx) => (
							<TabsTrigger
								key={idx}
								value={`${mode}-${idx + 1}`}
								onClick={() => setSelectedTier(idx + 1)}
								className={tabClasses}
							>
								Tier {idx + 1}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value={`recipes-${selectedTier}`}>
						{filterRecipeByWorkbenchTier(recipes, selectedTier).map((recipe) => (
							<div
								key={recipe.id}
								className="flex items-center gap-2"
							>
								{recipe.outputItemId}
							</div>
						))}
					</TabsContent>
					<TabsContent value={`requirements-${selectedTier}`}>
						{/* Replace with actual requirements logic */}
						<span className="text-muted-foreground">
							Requirements for Tier {selectedTier} go here.
						</span>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
