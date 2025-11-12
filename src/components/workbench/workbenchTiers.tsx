"use client";

import React from "react";

import { Book, Boxes, Egg } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAllWorkbenchRequirements, groupWorkbenchRecipesByTier } from "@/utils/workbenchUtils";
import { Tier, Workbench, WorkbenchRecipe } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkbenchItemReqTable } from "./workbenchItemReqTable";
import { RecipeItem } from "./recipeItem";

interface WorkbenchTiersProps {
	workbenchId: Workbench["id"];
	recipes: WorkbenchRecipe[];
	tiers: Tier[];
	curWbTier: number;
}

export default function WorkbenchTiers({
	workbenchId,
	recipes,
	tiers,
	curWbTier,
}: WorkbenchTiersProps) {
	// --- Tabs state and helpers ---
	const [mode, setMode] = React.useState<"recipes" | "requirements">("recipes");
	const tabValue = `${mode}-all`;

	const tabClasses = "px-4 py-2 cursor-pointer";

	return (
		<Card className="gap-2 p-1 sm:p-6 relative mt-18">
			<Tabs value={tabValue} className="w-full">
				<TabsList className="absolute -top-12 left-1 sm:left-6">
					<TabsTrigger
						value={`recipes-all`}
						onClick={() => setMode("recipes")}
						className={tabClasses}
					>
						{workbenchId !== "scrappy" ? (
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
					{tiers.length > 1 && (
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
					{workbenchId === "scrappy" ? (
						<ScrappyOutput currentTier={curWbTier} />
					) : (
						<WorkbenchRecipes recipes={recipes} />
					)}
				</TabsContent>
				<TabsContent value={`requirements-all`} className="w-full">
					<WorkbenchRequirements tiers={tiers} curWbTier={curWbTier} />
				</TabsContent>
			</Tabs>
		</Card>
	);
}

function WorkbenchRecipes({ recipes }: { recipes: WorkbenchRecipe[] }) {
	const groupedRecipes = groupWorkbenchRecipesByTier(recipes);

	return (
		<div className="flex flex-col gap-6">
			{Object.entries(groupedRecipes).map(([tier, recipes]) => (
				<div key={tier} className="flex flex-wrap items-center">
					<div className="flex items-center gap-2 w-full">
						<h4 className="ml-2 text-2xl font-semibold dark:text-muted-foreground">
							Level {tier}
						</h4>
					</div>
					<div className="flex flex-wrap gap-4 w-full">
						{recipes.map((recipe) => (
							<RecipeItem key={recipe.recipeId} recipe={recipe.recipe} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function WorkbenchRequirements({ tiers, curWbTier }: { tiers: Tier[]; curWbTier: number }) {
	// --- Requirements ---
	const allRequirements = getAllWorkbenchRequirements(tiers);

	return (
		<div>
			<div className="text-muted-foreground p-2">
				Required items across all tiers with total needed to reach max level.
			</div>
			<div className="p-2 bg-background rounded-lg">
				<WorkbenchItemReqTable
					requirements={allRequirements}
					totalTiers={tiers.length}
					highlightTier={curWbTier}
				/>
			</div>
		</div>
	);
}
