"use client";

import React from "react";

import { Book, Boxes, Egg } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAllWorkbenchRequirements } from "@/data/workbenches/workbenchUtils";
import { groupRecipesByWorkbenchTier } from "@/data/recipes/recipeUtils";
import { Recipe, Workbench, WorkbenchId } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecipes } from "@/contexts/recipeContext";
import { WorkbenchItemReqTable } from "./workbenchItemReqTable";
import { RecipeItem } from "./recipeItem";

interface WorkbenchTiersProps {
	workbench: Workbench;
	curWbTier: number;
}

export default function WorkbenchTiers({ workbench, curWbTier }: WorkbenchTiersProps) {
	const recipes = useRecipes().getRecipesByWorkbench(workbench.id);

	// --- Tabs state and helpers ---
	const [mode, setMode] = React.useState<"recipes" | "requirements">("recipes");
	const tabValue = `${mode}-all`;

	const tabClasses = "px-4 py-2 cursor-pointer";

	return (
		<Card className="gap-2 p-1 sm:p-6 relative mt-18">
			<Tabs
				value={tabValue}
				className="w-full"
			>
				<TabsList className="absolute -top-12 left-1 sm:left-6">
					<TabsTrigger
						value={`recipes-all`}
						onClick={() => setMode("recipes")}
						className={tabClasses}
					>
						{workbench.id !== "scrappy" ? (
							<>
								<Book />
								Recipes
							</>
						) : (
							<>
								<Egg />
								Outputs
							</>
						)}
					</TabsTrigger>
					{workbench.tiers.length > 1 && (
						<TabsTrigger
							value={`requirements-all`}
							onClick={() => setMode("requirements")}
							className={tabClasses}
						>
							<Boxes />
							Requirements
						</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value={`recipes-all`}>
					{workbench.id === "scrappy" ? (
						<ScrappyOutput currentTier={curWbTier} />
					) : (
						<WorkbenchRecipes
							recipes={recipes}
							workbenchId={workbench.id as WorkbenchId}
						/>
					)}
				</TabsContent>
				<TabsContent
					value={`requirements-all`}
					className="w-full"
				>
					<WorkbenchRequirements
						totalTiers={workbench.tiers.length}
						curWbTier={curWbTier}
						workbench={workbench}
					/>
				</TabsContent>
			</Tabs>
		</Card>
	);
}

function WorkbenchRecipes({
	recipes,
	workbenchId,
}: {
	recipes: Recipe[];
	workbenchId: WorkbenchId;
}) {
	const groupedRecipes = groupRecipesByWorkbenchTier(recipes, workbenchId);

	return (
		<div className="flex flex-col gap-6">
			{Object.entries(groupedRecipes).map(([tier, recipes]) => (
				<div
					key={tier}
					className="flex flex-wrap items-center gap-2"
				>
					<div className="flex items-center gap-2 w-full">
						<p>Tier {tier}</p>
					</div>
					<div className="flex flex-wrap gap-4">
						{recipes.map((recipe) => (
							<RecipeItem
								key={recipe.id}
								recipe={recipe}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function WorkbenchRequirements({
	totalTiers,
	curWbTier,
	workbench,
}: {
	totalTiers: number;
	curWbTier: number;
	workbench: Workbench;
}) {
	// --- Requirements ---
	const allRequirements = getAllWorkbenchRequirements([workbench]);

	return (
		<div>
			<div className="text-muted-foreground p-2">
				Required items across all tiers with total needed to reach max level.
			</div>
			<div className="p-2 bg-background rounded-lg">
				<WorkbenchItemReqTable
					requirements={allRequirements}
					totalTiers={totalTiers}
					highlightTier={curWbTier}
				/>
			</div>
		</div>
	);
}
