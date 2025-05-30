"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";
import { Recipe } from "@/types/items/recipe";
import { RecipeItem } from "./recipeItem";

interface RecipesListProps {
	recipes: Recipe[];
	currentTier: number;
	workbenchId: string;
}

export function RecipesList({ recipes, currentTier, workbenchId }: RecipesListProps) {
	// Filter and separate recipes by tier availability
	const { availableRecipes, lockedRecipes } = recipes.reduce<{
		availableRecipes: Recipe[];
		lockedRecipes: Recipe[];
	}>(
		(acc, recipe) => {
			const workbenchReq = recipe.workbench?.find((wb) => wb.workbench === workbenchId);
			if (!workbenchReq) return acc;

			if (workbenchReq.tier <= currentTier) {
				acc.availableRecipes.push(recipe);
			} else {
				acc.lockedRecipes.push(recipe);
			}
			return acc;
		},
		{ availableRecipes: [], lockedRecipes: [] }
	);

	// Map available recipes to components
	const availableRecipeItems = availableRecipes.map((recipe) => (
		<RecipeItem
			key={recipe.id}
			recipe={recipe}
			className="h-full"
		/>
	));

	// Map locked recipes to components
	const lockedRecipeItems = lockedRecipes.map((recipe) => (
		<RecipeItem
			key={recipe.id}
			recipe={recipe}
			className="h-full opacity-50"
		/>
	));

	return (
		<div className="grid gap-6">
			{/* Available Recipes */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Available Recipes</CardTitle>
					<CardDescription>Recipes you can craft with your current tier</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-fit">
						<div className="space-y-3">
							{availableRecipeItems.length > 0 ? (
								availableRecipeItems
							) : (
								<div className="text-center py-6 text-muted-foreground">
									No available recipes for your current tier
								</div>
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>

			{/* Locked Recipes */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Locked Recipes</CardTitle>
					<CardDescription>Recipes that require higher tiers to unlock</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-fit">
						<div className="space-y-4">
							{lockedRecipeItems.length > 0 ? (
								lockedRecipeItems
							) : (
								<div className="text-center py-6 text-muted-foreground">
									No locked recipes found
								</div>
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
