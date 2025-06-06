"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkbenchId } from "@/types/items/recipe";
import {
	filterRecipeByWorkbenchTier,
	groupRecipesByWorkbenchTier,
} from "@/data/recipes/recipeUtils";
import { Book, Boxes, Egg, Lock } from "lucide-react";
import { useRecipes } from "@/contexts/recipeContext";
import { Recipe, Workbench } from "@/types";
import { ScrappyOutput } from "./scrappyOutput";
import { getAllWorkbenchRequirements } from "@/data/workbenches/workbenchUtils";
import { Card } from "@/components/ui/card";
import { WorkbenchItemReqTable } from "./workbenchItemReqTable";
import { useItems } from "@/contexts/itemContext";
import getItemIcon from "@/components/items/getItemIcon";
import { formatName, getRarityColor } from "@/data/items/itemUtils";
import { useDialog } from "@/contexts/dialogContext";

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

function RecipeItem({ recipe }: { recipe: Recipe }) {
	const { getItemById } = useItems();
	const { openDialog } = useDialog();
	const outputItem = getItemById(recipe.outputItemId);

	if (!outputItem) return null;

	return (
		<div
			key={recipe.id}
			className="flex flex-col items-start p-2"
		>
			<div
				className="flex items-center gap-2 pr-2 rounded hover:bg-primary/10 cursor-pointer"
				onClick={() => {
					openDialog("item", outputItem);
				}}
			>
				{getItemIcon(
					outputItem.icon,
					`w-12 h-12 p-2 rounded text-card ${getRarityColor(outputItem.rarity, "bg")}`
				)}
				<p className="mb-[2px] font-mono">{recipe.outputCount}</p>
				<p className="mb-[2px]">{outputItem.name}</p>
			</div>
			<div className="flex flex-col gap-2 text-md p-3">
				{recipe.requirements.length === 0 ? (
					<div className="flex items-center gap-2 text-muted-foreground">
						<p className="mb-[2px] font-bold font-mono">Unknown Requirements</p>
					</div>
				) : (
					recipe.requirements.map((requirement) => {
						const reqItem = getItemById(requirement.itemId);
						if (!reqItem) return null;

						return (
							<div
								key={requirement.itemId}
								className="flex items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer"
								onClick={() => {
									openDialog("item", reqItem);
								}}
							>
								{getItemIcon(
									reqItem.icon,
									`w-6 h-6 ${getRarityColor(reqItem.rarity, "text")}`
								)}
								<p className="mb-[2px] font-bold font-mono">{requirement.count}</p>
								<p className="mb-[2px]">{reqItem.name}</p>
							</div>
						);
					})
				)}
			</div>
			{recipe.isLocked && (
				<div className="flex items-center gap-2 text-red-400 px-3">
					<Lock size={14} />
					{Object.entries(recipe.lockedType ?? {}).map(([key, value]) => {
						if (typeof value === "boolean") {
							return <p key={key}>{formatName(key)}</p>;
						}

						return (
							<p key={key}>
								{value === "Mastery" ? "" : value} {formatName(key)}
							</p>
						);
					})}
				</div>
			)}
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
