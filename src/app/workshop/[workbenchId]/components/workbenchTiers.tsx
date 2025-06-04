"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	filterRecipeByWorkbenchTier,
	filterRecipesAvailableByTier,
} from "@/data/recipes/recipeUtils";
import { Book, Boxes, Egg } from "lucide-react";
import { useRecipes } from "@/contexts/recipeContext";
import { Recipe, Workbench } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";

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
		<div className="flex gap-2 p-6 border-2 bg-card rounded-lg relative mt-18">
			{/* Mode and Tier Tabs */}

			<Tabs value={tabValue}>
				<TabsList className="absolute -top-12 left-6">
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
					<TabsTrigger
						value={`requirements-${selectedTier}`}
						onClick={() => setMode("requirements")}
						className={tabClasses}
					>
						<Boxes />
						Requirements
					</TabsTrigger>
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
				<TabsContent value={`requirements-${selectedTier}`}>
					<WorkbenchRequirements selectedTier={selectedTier} />
				</TabsContent>
			</Tabs>
		</div>
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

function WorkbenchRequirements({ selectedTier }: { selectedTier: number | "all" }) {
	return (
		<div>
			{selectedTier === "all" ? (
				<span className="text-muted-foreground">Requirements for ALL Tiers go here.</span>
			) : (
				<span className="text-muted-foreground">
					Requirements for Tier {selectedTier} go here.
				</span>
			)}
		</div>
	);
}
