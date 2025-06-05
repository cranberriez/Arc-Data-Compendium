"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterRecipeByWorkbenchTier } from "@/data/recipes/recipeUtils";
import { Book, Boxes, Egg } from "lucide-react";
import { useRecipes } from "@/contexts/recipeContext";
import { Recipe, Workbench } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";
import {
	getAllWorkbenchRequirements,
	getWorkbenchRequirementsRange,
	WorkbenchRequirement,
} from "@/data/workbenches/workbenchUtils";
import { Card } from "@/components/ui/card";
import { WorkbenchItemReqTable } from "./workbenchItemReqTable";

interface WorkbenchTiersProps {
	workbench: Workbench;
	curWbTier: number;
}

export default function WorkbenchTiers({ workbench, curWbTier }: WorkbenchTiersProps) {
	const recipes = useRecipes().getRecipesByWorkbench(workbench.id);

	// --- Tabs state and helpers ---
	const [mode, setMode] = React.useState<"recipes" | "requirements">("recipes");
	const [selectedTier, setSelectedTier] = React.useState<number | "all">("all");
	const tabValue = `${mode}-${selectedTier}`;

	const tabClasses = "px-4 py-2 cursor-pointer";

	return (
		<Card className="gap-2 p-1 sm:p-6 relative mt-18">
			{/* Mode and Tier Tabs */}
			<Tabs
				value={tabValue}
				className="w-full"
			>
				<TabsList className="absolute -top-12 left-1 sm:left-6">
					<TabsTrigger
						value={`recipes-${selectedTier}`}
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
							value={`requirements-${selectedTier}`}
							onClick={() => setMode("requirements")}
							className={tabClasses}
						>
							<Boxes />
							Requirements
						</TabsTrigger>
					)}
				</TabsList>

				{workbench.id !== "basic_bench" && (
					<TabsList>
						<TabsTrigger
							value={`${mode}-all`}
							onClick={() => setSelectedTier("all")}
							className={tabClasses}
						>
							{workbench.id !== "scrappy" ? "All" : "Current"}
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
				)}

				<TabsContent value={`recipes-${selectedTier}`}>
					<WorkbenchRecipeContainer
						selectedTier={selectedTier}
						workbenchId={workbench.id}
						currentTier={curWbTier}
						recipes={recipes}
					/>
				</TabsContent>
				<TabsContent
					value={`requirements-${selectedTier}`}
					className="w-full"
				>
					<WorkbenchRequirements
						selectedTier={selectedTier}
						totalTiers={workbench.tiers.length}
						curWbTier={curWbTier}
						workbench={workbench}
					/>
				</TabsContent>
			</Tabs>
		</Card>
	);
}

function WorkbenchRecipeContainer({
	selectedTier,
	workbenchId,
	currentTier,
	recipes,
}: {
	selectedTier: number | "all";
	workbenchId: string;
	currentTier: number;
	recipes: Recipe[];
}) {
	if (workbenchId === "scrappy") {
		return (
			<ScrappyOutput
				selectedTier={selectedTier}
				currentTier={currentTier}
			/>
		);
	}

	return selectedTier === "all" ? (
		<WorkbenchRecipes recipes={recipes} />
	) : (
		<WorkbenchRecipes recipes={filterRecipeByWorkbenchTier(recipes, selectedTier)} />
	);
}

function WorkbenchRecipes({ recipes }: { recipes: Recipe[] }) {
	return (
		<div>
			{recipes.map((recipe) => (
				<div
					key={recipe.id}
					className="flex items-center gap-2"
				>
					{recipe.outputItemId}
				</div>
			))}
		</div>
	);
}

function WorkbenchRequirements({
	selectedTier,
	totalTiers,
	curWbTier,
	workbench,
}: {
	selectedTier: number | "all";
	totalTiers: number;
	curWbTier: number;
	workbench: Workbench;
}) {
	// --- Requirements ---
	const allRequirements = getAllWorkbenchRequirements([workbench]);

	return (
		<div>
			{selectedTier === "all" ? (
				<>
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
				</>
			) : (
				<div className="flex flex-wrap items-stretch gap-2">
					<div className="flex flex-col flex-1 min-w-fit">
						<div className="text-muted-foreground p-2">
							Upgrading from {selectedTier - 1 > 0 ? selectedTier - 1 : "Unbuilt"} to
							Tier {selectedTier}
						</div>

						<div className="p-2 bg-background rounded-lg flex-1">
							<WorkbenchUpgradeReqTableRange
								workbench={workbench}
								range={[selectedTier, selectedTier]}
								totalTiers={0}
							/>
						</div>
					</div>
					{selectedTier > curWbTier + 1 && (
						<div className="flex flex-col flex-1 min-w-fit">
							<div className="text-muted-foreground p-2">
								Upgrading from {selectedTier - 1 > 0 ? selectedTier - 1 : "Unbuilt"}{" "}
								to Tier {selectedTier}
							</div>
							<div className="p-2 bg-background rounded-lg flex-1">
								<WorkbenchUpgradeReqTableRange
									workbench={workbench}
									range={[curWbTier, selectedTier]}
									totalTiers={selectedTier - curWbTier}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function WorkbenchUpgradeReqTableRange({
	workbench,
	range,
	totalTiers,
}: {
	workbench: Workbench;
	range: [number, number];
	totalTiers: number;
}) {
	let [min, max] = range;
	const requirements = getWorkbenchRequirementsRange([workbench], min, max);

	return (
		<WorkbenchItemReqTable
			requirements={requirements}
			totalTiers={totalTiers}
		/>
	);
}
