"use client";

import { Recipe } from "@/types/items/recipe";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "@/components/items/ItemCard";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeItemProps {
	recipe: Recipe;
	onSelect?: (recipe: Recipe) => void;
	className?: string;
}

export function RecipeItem({ recipe, onSelect, className }: RecipeItemProps) {
	const { getItemById } = useItems();
	const outputItem = getItemById(recipe.outputItemId);

	// Determine if the recipe is locked
	const isLocked = recipe.recipeLocked;

	const handleClick = () => {
		if (onSelect && !isLocked) {
			onSelect(recipe);
		}
	};

	return (
		<div
			className={cn(
				"rounded-lg border p-4 transition-colors",
				{
					"hover:border-blue-500": !isLocked && onSelect,
					"opacity-70 border-dashed": isLocked,
				},
				className
			)}
			onClick={handleClick}
		>
			<div className="flex flex-col gap-3">
				{/* Output Item */}
				{outputItem && (
					<div className="flex items-center gap-2 mb-2">
						<ItemCard
							item={outputItem}
							variant="icon"
							size="lg"
							showBorder={false}
						/>
						<div>
							<h5 className="font-medium">
								{recipe.outputCount}x {outputItem.name}
							</h5>
							{recipe.craftTime > 0 && (
								<p className="text-sm text-muted-foreground">
									Craft time: {recipe.craftTime}s
								</p>
							)}
						</div>
					</div>
				)}

				{/* Requirements */}
				{recipe.requirements.length > 0 && (
					<div className="mt-1">
						<h6 className="text-sm font-medium text-muted-foreground mb-3">
							Requirements:
						</h6>
						<div className="flex gap-3">
							{recipe.requirements.map((req) => {
								const item = getItemById(req.itemId);
								return item ? (
									<div key={req.itemId}>
										<ItemCard
											item={item}
											count={req.count}
											variant="compact"
											orientation="horizontal"
											size="sm"
										/>
									</div>
								) : null;
							})}
						</div>
					</div>
				)}

				{/* Locked State */}
				{isLocked && (
					<div className="mt-2 flex items-center gap-1 text-muted-foreground text-sm">
						<Lock className="h-3 w-3" />
						<span>Locked</span>
						{recipe.lockedType?.quest && (
							<span className="ml-1">(Quest: {recipe.lockedType.quest})</span>
						)}
						{recipe.lockedType?.mastery && (
							<span className="ml-1">(Mastery: {recipe.lockedType.mastery})</span>
						)}
						{recipe.lockedType?.looted && <span className="ml-1">(Found in raid)</span>}
						{recipe.lockedType?.event && (
							<span className="ml-1">(Event: {recipe.lockedType.event})</span>
						)}
						{recipe.lockedType?.unsure && (
							<span className="ml-1">(Unknown unlock condition)</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
