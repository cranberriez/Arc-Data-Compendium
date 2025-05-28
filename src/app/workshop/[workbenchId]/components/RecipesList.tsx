"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";
import { Recipe } from "./RecipeSheet";

interface RecipesListProps {
	recipes: Recipe[];
	currentTier: number;
	onRecipeSelect: (recipe: Recipe) => void;
}

export function RecipesList({ recipes, currentTier, onRecipeSelect }: RecipesListProps) {
	// Filter recipes by availability
	const availableRecipes = recipes.filter((recipe) => recipe.unlocked);

	// Group locked recipes by tier
	const lockedRecipesByTier = recipes
		.filter((recipe) => !recipe.unlocked)
		.reduce((acc, recipe) => {
			if (!acc[recipe.unlockTier]) {
				acc[recipe.unlockTier] = [];
			}
			acc[recipe.unlockTier].push(recipe);
			return acc;
		}, {} as Record<number, Recipe[]>);

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
							{availableRecipes.length > 0 ? (
								availableRecipes.map((recipe) => (
									<div
										key={recipe.id}
										className="rounded-lg border p-4 cursor-pointer hover:border-blue-500 transition-colors"
										onClick={() => onRecipeSelect(recipe)}
									>
										<div className="flex items-start gap-3">
											<ItemIconSkeleton size="sm" />
											<div className="flex-1">
												<div className="flex items-start justify-between">
													<div>
														<h5 className="font-medium">
															{recipe.name}
														</h5>
														<p className="text-sm text-muted-foreground">
															{recipe.description}
														</p>
														<Badge
															variant="secondary"
															className="mt-1 text-xs bg-blue-500 text-white"
														>
															Tier {recipe.unlockTier}
														</Badge>
													</div>
												</div>
												<div className="mt-2 flex flex-wrap gap-1">
													{recipe.materials.map((material) => (
														<Badge
															key={material.itemId}
															variant="outline"
															className="text-xs"
														>
															{material.count}x{" "}
															{material.name ||
																material.itemId.replace(/_/g, " ")}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</div>
								))
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
							{Object.entries(lockedRecipesByTier).length > 0 ? (
								Object.entries(lockedRecipesByTier).map(([tier, recipes]) => (
									<div
										key={tier}
										className="space-y-3"
									>
										<div className="flex items-center gap-2">
											<Lock className="h-4 w-4 text-muted-foreground" />
											<h6 className="font-medium text-muted-foreground">
												Tier {tier} Recipes
											</h6>
										</div>
										{recipes.map((recipe) => (
											<div
												key={recipe.id}
												className="rounded-lg border border-dashed p-4 opacity-60 cursor-pointer hover:opacity-70 transition-opacity"
												onClick={() => onRecipeSelect(recipe)}
											>
												<div className="flex items-start gap-3">
													<ItemIconSkeleton size="sm" />
													<div className="flex-1">
														<div className="flex items-start justify-between">
															<div>
																<h5 className="font-medium">
																	{recipe.name}
																</h5>
																<p className="text-sm text-muted-foreground">
																	{recipe.description}
																</p>
																<Badge
																	variant="outline"
																	className="mt-1 text-xs"
																>
																	Unlocks at Tier{" "}
																	{recipe.unlockTier}
																</Badge>
															</div>
														</div>
														<div className="mt-2 flex flex-wrap gap-1">
															{recipe.materials.map((material) => (
																<Badge
																	key={material.itemId}
																	variant="outline"
																	className="text-xs opacity-60"
																>
																	{material.count}x{" "}
																	{material.name ||
																		material.itemId.replace(
																			/_/g,
																			" "
																		)}
																</Badge>
															))}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								))
							) : (
								<div className="text-center py-6 text-muted-foreground">
									No locked recipes to display
								</div>
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
