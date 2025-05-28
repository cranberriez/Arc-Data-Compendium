"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";
import { Recipe } from "./RecipeSheet";

export interface Tier {
	tier: number;
	requiredItems: {
		itemId: string;
		count: number;
		name?: string;
	}[];
	raidsRequired?: number;
}

interface TierSelectorProps {
	tiers: Tier[];
	currentTier: number;
	recipes: Recipe[];
	onRecipeSelect: (recipe: Recipe) => void;
}

export function TierSelector({ tiers, currentTier, recipes, onRecipeSelect }: TierSelectorProps) {
	const [selectedTier, setSelectedTier] = useState<number>(currentTier);

	// Sort tiers by tier number if not already sorted
	const sortedTiers = [...tiers].sort((a, b) => a.tier - b.tier);

	return (
		<Tabs
			value={selectedTier.toString()}
			onValueChange={(value) => setSelectedTier(Number.parseInt(value))}
		>
			<TabsList
				className="grid w-full"
				style={{ gridTemplateColumns: `repeat(${sortedTiers.length}, 1fr)` }}
			>
				{sortedTiers.map((tier) => (
					<TabsTrigger
						key={tier.tier}
						value={tier.tier.toString()}
						className={
							tier.tier === currentTier
								? "bg-blue-500 text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
								: ""
						}
					>
						Tier {tier.tier}
					</TabsTrigger>
				))}
			</TabsList>

			{sortedTiers.map((tier) => (
				<TabsContent
					key={tier.tier}
					value={tier.tier.toString()}
					className="space-y-4"
				>
					<div className="space-y-3">
						<h4 className="font-semibold">Requirements</h4>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{tier.requiredItems.map((item) => (
								<div
									key={item.itemId}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									<ItemIconSkeleton size="default" />
									<div className="flex-1">
										<p className="font-medium">
											{item.name || item.itemId.replace(/_/g, " ")}
										</p>
										<Badge
											variant="secondary"
											className="text-xs bg-blue-500 text-white"
										>
											{item.count}x
										</Badge>
									</div>
								</div>
							))}
						</div>
						{tier.raidsRequired && (
							<Badge
								variant="outline"
								className="border-blue-500 text-blue-600"
							>
								Requires {tier.raidsRequired} raids
							</Badge>
						)}
					</div>

					<Separator />

					<div className="space-y-3">
						<h4 className="font-semibold">Recipes Unlocked at This Tier</h4>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{recipes
								.filter((recipe) => recipe.unlockTier === tier.tier)
								.map((recipe) => (
									<div
										key={recipe.id}
										className={`rounded-lg border p-4 cursor-pointer ${
											recipe.unlocked
												? "hover:border-blue-500"
												: "border-dashed opacity-70"
										} transition-colors`}
										onClick={() => onRecipeSelect(recipe)}
									>
										<div className="flex items-start gap-3">
											<ItemIconSkeleton size="sm" />
											<div className="flex-1">
												<h5 className="font-medium">{recipe.name}</h5>
												<p className="text-sm text-muted-foreground">
													{recipe.description}
												</p>
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
												{!recipe.unlocked && (
													<div className="mt-2 flex items-center gap-1 text-muted-foreground">
														<Lock className="h-3 w-3" />
														<span className="text-xs">Locked</span>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
