"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Recipe } from "@/types/items/recipe";

import { useItems } from "@/contexts/itemContext";
import { useRecipes } from "@/contexts/recipeContext";
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

	return (
		<div className="w-full">
			<Card>
				<CardHeader>
					<CardTitle>{workbench.name}</CardTitle>
					<CardDescription>{workbench.description}</CardDescription>
				</CardHeader>
				<CardContent></CardContent>
			</Card>
		</div>
	);
}
