"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Unlock } from "lucide-react";
import { ItemCard } from "@/components/items/ItemCard";
import { Recipe } from "./RecipeSheet";
import { useItems } from "@/contexts/itemContext";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";
import { cn } from "@/lib/utils";

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
	const [selectedTier, setSelectedTier] = useState<number>(tiers[0].tier);
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
				className="grid w-full mb-4 gap-1 h-fit"
				style={{ gridTemplateColumns: `repeat(${sortedTiers.length}, 1fr)` }}
			>
				{sortedTiers.map((tier) => (
					<TabsTrigger
						key={tier.tier}
						value={tier.tier.toString()}
						className={cn(
							"grid grid-cols-3",
							"cursor-pointer border-2 border-transparent hover:text-primary transition-colors",
							tier.tier === currentTier
								? "border-blue-400/50! bg-blue-400/10! text-primary! data-[state=active]:border-blue-400! data-[state=active]:bg-blue-400/40!"
								: "",
							tier.tier === currentTier + 1
								? "border-dashed border-green-400/40! data-[state=active]:border-green-400! data-[state=active]:bg-green-400/20!"
								: ""
						)}
					>
						{tier.tier === currentTier + 1 ? (
							<Unlock className="h-4 w-4 text-green-400" />
						) : (
							<span></span>
						)}

						{tier.tier < currentTier ? <span></span> : null}
						<span>Tier {tier.tier}</span>
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
						<h4 className="font-semibold">
							{tier.requiredItems.length > 0 ? "Requirements" : "No Required Items"}
						</h4>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{tier.requiredItems.map((item) => {
								const itemData = getItemById(item.itemId);
								if (!itemData) return null;

								return (
									<div
										key={item.itemId}
										className="flex items-center gap-2"
									>
										{isLoading ? (
											<ItemIconSkeleton
												key={item.itemId}
												className="h-16 w-16"
											/>
										) : (
											<ItemCard
												item={itemData}
												key={item.itemId}
												variant="icon"
												size="xl"
												showBorder={false}
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
