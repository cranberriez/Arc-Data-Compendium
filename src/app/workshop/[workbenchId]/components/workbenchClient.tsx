"use client";

import { useState } from "react";
import { Swords, Shirt, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";

import { WorkbenchHeader } from "./workbenchHeader";
import { TierSelector, Tier } from "./tierSelector";
import { Recipe } from "@/types/items/recipe";

import { useItems } from "@/contexts/itemContext";
import { useRecipes } from "@/contexts/recipeContext";
import { RecipesList } from "./recipesList";
import { WorkbenchOverview } from "./workbenchOverview";
import { Workbench } from "@/types";

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const { getItemById } = useItems();
	const recipes = useRecipes().getRecipesByWorkbench(workbench.id);

	// Calculate derived values
	const currentTier = workbench.baseTier;

	// Map tiers to the format expected by TierSelector
	const mappedTiers: Tier[] = workbench.tiers.map((tier) => ({
		tier: tier.tier,
		requiredItems: tier.requiredItems,
		raidsRequired: tier.raidsRequired,
	}));

	return (
		<TooltipProvider>
			<div className="mx-auto max-w-6xl space-y-6">
				{/* Header & Navigation */}
				<WorkbenchHeader currentTier={currentTier} />

				{/* Workbench Overview Card */}
				<WorkbenchOverview
					workbench={workbench}
					currentTier={currentTier}
				/>

				{/* Tiers & Requirements Section */}
				<Card>
					<CardHeader>
						<CardTitle>Tier Requirements & Recipes</CardTitle>
						<CardDescription>
							View requirements and available recipes for each tier
						</CardDescription>
					</CardHeader>
					<CardContent>
						<TierSelector
							tiers={mappedTiers}
							currentTier={currentTier}
							recipes={recipes}
							onRecipeSelect={setSelectedRecipe}
							workbenchId={workbench.id}
						/>
					</CardContent>
				</Card>

				{/* Crafting Section */}
				<RecipesList
					recipes={recipes}
					currentTier={currentTier}
					workbenchId={workbench.id}
					// onRecipeSelect={setSelectedRecipe}
				/>
			</div>

			{/* Recipe Details Sheet */}
			{/* <RecipeSheet
				selectedRecipe={selectedRecipe}
				onOpenChange={(open) => !open && setSelectedRecipe(null)}
			/> */}
		</TooltipProvider>
	);
}
