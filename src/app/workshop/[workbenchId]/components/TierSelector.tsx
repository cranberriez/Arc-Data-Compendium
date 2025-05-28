"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { ItemCard } from "@/components/items/itemDisplay";
import { Recipe } from "./RecipeSheet";
import { useItems } from "@/contexts/itemContext";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";

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
	const { getItemById, isLoading } = useItems();

	// Sort tiers by tier number if not already sorted
	const sortedTiers = [...tiers].sort((a, b) => a.tier - b.tier);

	return (
		<Tabs
			value={selectedTier.toString()}
			onValueChange={(value) => setSelectedTier(Number.parseInt(value))}
			className="w-full"
		>
			<TabsList
				className="grid w-full mb-4 gap-1"
				style={{ gridTemplateColumns: `repeat(${sortedTiers.length}, 1fr)` }}
			>
				{sortedTiers.map((tier) => (
					<TabsTrigger
						key={tier.tier}
						value={tier.tier.toString()}
						className={
							tier.tier === currentTier
								? "bg-blue-500 text-primary data-[state=active]:bg-red-500"
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
							{tier.requiredItems.map((item) => {
								const itemData = getItemById(item.itemId);

								return (
									<div
										key={item.itemId}
										className="flex items-center gap-2"
									>
										{isLoading ? (
											<ItemIconSkeleton className="h-16 w-16" />
										) : (
											<ItemCard
												item={itemData}
												variant="icon"
												hideText={true}
											/>
										)}
										<div className="flex-1">
											<p className="font-medium text-lg">
												{itemData?.name || item.itemId.replace(/_/g, " ")}
											</p>
											<Badge
												variant="secondary"
												className="text-base"
											>
												{item.count}x
											</Badge>
										</div>
									</div>
								);
							})}
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
										<div className="flex flex-col gap-2">
											<h5 className="font-medium">{recipe.name}</h5>
											{recipe.description && (
												<p className="text-sm text-muted-foreground">
													{recipe.description}
												</p>
											)}
											<div className="mt-2 grid grid-cols-2 gap-2">
												{recipe.materials.map((material) => {
													const materialData = getItemById(
														material.itemId
													);
													return (
														<ItemCard
															key={material.itemId}
															item={materialData}
															count={material.count}
															variant="icon"
															size="sm"
															className="h-full"
															hideText={false}
														/>
													);
												})}
											</div>
											{!recipe.unlocked && (
												<div className="mt-2 flex items-center gap-1 text-muted-foreground text-sm">
													<Lock className="h-3 w-3" />
													<span>Locked</span>
												</div>
											)}
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
