"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	filterRecipeByWorkbenchTier,
	groupRecipesByWorkbenchTier,
} from "@/data/recipes/recipeUtils";
import { Book, Boxes, Egg } from "lucide-react";
import { useRecipes } from "@/contexts/recipeContext";
import { Recipe, Workbench } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";
import { getAllWorkbenchRequirements } from "@/data/workbenches/workbenchUtils";
import { Card } from "@/components/ui/card";
import { WorkbenchItemReqTable } from "./workbenchItemReqTable";
import ItemCard from "@/components/items/ItemCard";
import { useItems } from "@/contexts/itemContext";
import getItemIcon from "@/components/items/getItemIcon";
import { getRarityColor } from "@/data/items/itemUtils";

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
						<WorkbenchRecipes recipes={recipes} />
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

function WorkbenchRecipes({ recipes }: { recipes: Recipe[] }) {
	const groupedRecipes = groupRecipesByWorkbenchTier(recipes);

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
					<div className="flex flex-wrap items-center gap-4">
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

function RecipeItem({ recipe }: { recipe: Recipe }) {
	const { getItemById } = useItems();
	const outputItem = getItemById(recipe.outputItemId);

	if (!outputItem) return null;

	return (
		<div
			key={recipe.id}
			className="flex items-center gap-4 border-2 p-2"
		>
			<div className="flex items-center gap-2">
				{getItemIcon(
					outputItem.icon,
					`w-6 h-6 ${getRarityColor(outputItem.rarity, "text")}`
				)}
				<p className="mb-[2px]">{recipe.outputCount}</p>
				<p className="mb-[2px]">{outputItem.name}</p>
			</div>
			<div className="flex flex-col gap-2 text-sm">
				{recipe.requirements.map((requirement) => {
					const reqItem = getItemById(requirement.itemId);
					if (!reqItem) return null;

					return (
						<div
							key={requirement.itemId}
							className="flex items-center gap-2"
						>
							{getItemIcon(
								reqItem.icon,
								`w-4 h-4 ${getRarityColor(reqItem.rarity, "text")}`
							)}
							<p className="mb-[2px]">{requirement.count}</p>
							<p className="mb-[2px]">{reqItem.name}</p>
						</div>
					);
				})}
			</div>
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
