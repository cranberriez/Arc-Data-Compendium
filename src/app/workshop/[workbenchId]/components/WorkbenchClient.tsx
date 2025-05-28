"use client";

import { useState } from "react";
import { Swords, Shirt, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";

import { WorkbenchHeader } from "./WorkbenchHeader";
import { UpgradeButtons } from "./UpgradeButtons";
import { TierSelector, Tier } from "./TierSelector";
import { RecipesList } from "./RecipesList";
import { RecipeSheet, Recipe } from "./RecipeSheet";

interface WorkbenchData {
	id: string;
	name: string;
	description: string;
	icon: string;
	baseTier: number;
	tiers: {
		tier: number;
		requiredItems: {
			itemId: string;
			count: number;
		}[];
		raidsRequired?: number;
	}[];
}

interface WorkbenchClientProps {
	workbench: WorkbenchData;
	recipes: Recipe[];
}

export function WorkbenchClient({ workbench, recipes }: WorkbenchClientProps) {
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

	// Calculate derived values
	const currentTier = workbench.baseTier;
	const maxTier = Math.max(...workbench.tiers.map((t) => t.tier));
	const progressPercentage = (currentTier / maxTier) * 100;

	// Get next tier requirements if available
	const nextTier = workbench.tiers.find((t) => t.tier > currentTier);

	// Map tiers to the format expected by TierSelector
	const mappedTiers: Tier[] = workbench.tiers.map((tier) => ({
		tier: tier.tier,
		requiredItems: tier.requiredItems,
		raidsRequired: tier.raidsRequired,
	}));

	// Get icon component
	const getIconComponent = (iconName: string) => {
		switch (iconName) {
			case "Swords":
				return <Swords className="h-8 w-8 text-white" />;
			case "Shirt":
				return <Shirt className="h-8 w-8 text-white" />;
			default:
				return <Layers className="h-8 w-8 text-white" />;
		}
	};

	// Simulated handlers for upgrade/downgrade - these would be implemented with real logic
	const handleUpgrade = () => {
		console.log("Upgrading workbench");
		// This would handle the actual upgrade logic in a real implementation
	};

	const handleDowngrade = () => {
		console.log("Downgrading workbench");
		// This would handle the actual downgrade logic in a real implementation
	};

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
				<div className="mx-auto max-w-6xl space-y-6">
					{/* Header & Navigation */}
					<WorkbenchHeader currentTier={currentTier} />

					{/* Workbench Overview Card */}
					<Card>
						<CardHeader className="p-2 sm:p-6">
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-blue-500 p-3">
									{getIconComponent(workbench.icon)}
								</div>
								<div className="flex-1">
									<CardTitle className="text-2xl">{workbench.name}</CardTitle>
									<CardDescription className="text-base">
										{workbench.description}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-2 sm:p-6">
							<div className="grid grid-cols-[1fr] lg:grid-cols-[3fr_1fr] gap-6">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Tier Progress</span>
										<span className="text-sm text-muted-foreground">
											{currentTier} / {maxTier}
										</span>
									</div>
									<Progress
										value={progressPercentage}
										className="h-3"
									/>

									<UpgradeButtons
										currentTier={currentTier}
										maxTier={maxTier}
										onUpgrade={handleUpgrade}
										onDowngrade={handleDowngrade}
									/>
								</div>

								{nextTier && (
									<div className="hidden lg:block">
										<h4 className="text-sm font-medium mb-2">
											Next Tier Requirements
										</h4>
										<div className="flex flex-col gap-2">
											{nextTier.requiredItems.map((item) => (
												<div
													key={item.itemId}
													className="flex items-center gap-2"
												>
													<div className="h-6 w-6 rounded bg-muted" />
													<span className="text-sm">
														{item.itemId.replace(/_/g, " ")}
													</span>
													<Badge
														variant="secondary"
														className="bg-blue-500 text-white text-xs"
													>
														{item.count}x
													</Badge>
												</div>
											))}
											{nextTier.raidsRequired && (
												<Badge className="mt-1 bg-blue-600 text-white w-fit">
													{nextTier.raidsRequired} raids required
												</Badge>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Mobile view for next tier requirements */}
							{nextTier && (
								<div className="lg:hidden rounded-lg mt-6 bg-muted p-3">
									<h4 className="text-sm font-medium mb-2">
										Next Tier Requirements
									</h4>
									<div className="flex flex-wrap gap-2">
										{nextTier.requiredItems.map((item) => (
											<Badge
												key={item.itemId}
												variant="outline"
											>
												{item.count}x {item.itemId.replace(/_/g, " ")}
											</Badge>
										))}
										{nextTier.raidsRequired && (
											<Badge className="bg-blue-600 text-white">
												{nextTier.raidsRequired} raids
											</Badge>
										)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

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
							/>
						</CardContent>
					</Card>

					{/* Crafting Section */}
					<RecipesList
						recipes={recipes}
						currentTier={currentTier}
						onRecipeSelect={setSelectedRecipe}
					/>
				</div>
			</div>

			{/* Recipe Details Sheet */}
			<RecipeSheet
				selectedRecipe={selectedRecipe}
				onOpenChange={(open) => !open && setSelectedRecipe(null)}
			/>
		</TooltipProvider>
	);
}
