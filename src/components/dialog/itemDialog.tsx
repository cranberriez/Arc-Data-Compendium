"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ItemHeader, RecyclingSection, SourcesSection, QuickUseSection, GearSection } from ".";
import { getItemTags } from "@/utils/items";
import { useDialog } from "@/hooks/useUI";
import { useRecipes } from "@/hooks/useData";
import { Item, Recipe } from "@/types";

export function ItemDialog() {
	const { dialogQueue, dialogOpen, dialogData, closeDialog, backDialog } = useDialog();
	const { getRecyclingSourcesById } = useRecipes();

	if (!dialogData) return null;
	const item = dialogData as Item;

	// Custom close handler to clear the queue
	const handleCloseDialog = () => {
		closeDialog();
	};

	// Back navigation
	const handleBack = () => {
		backDialog();
	};

	const quickUseStats = item.quickUse?.stats ?? null;
	const quickUseCharge = item.quickUse?.charge ?? null;
	const gearStats = item.gear?.stats;
	const gearType = item.gear?.category;
	const recyclingRecipe: Recipe | null = item.recycling ?? null;
	const craftingRecipe: Recipe | null = item.recipe ?? null;
	const recyclingSources = getRecyclingSourcesById(item.id ?? "");
	const itemTags = getItemTags(item);

	return (
		<Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
			<DialogContent className="p-2 sm:p-6">
				{/* Back buttons */}
				{dialogQueue.length > 0 && (
					<div>
						<Button
							variant="secondary"
							onClick={handleBack}
							className="px-3 py-1 cursor-pointer max-w-[80%]"
						>
							← Back to
							<span className="truncate">
								{dialogQueue[dialogQueue.length - 1].name}
							</span>
						</Button>
					</div>
				)}
				{/* Dialog Header */}
				<ItemHeader item={item} itemTags={itemTags} />

				{item.flavorText && item.flavorText !== "" && (
					<div className="bg-secondary p-2 rounded w-full max-w-full break-words">
						{item.flavorText}
					</div>
				)}

				{quickUseStats ||
				quickUseCharge ||
				gearStats ||
				gearType ||
				recyclingRecipe ||
				craftingRecipe ? (
					<hr className="my-2 border-t border-t-secondary-foreground/20 dark:border-t-secondary-foreground/10" />
				) : null}

				{/* Quick Use Section */}
				{quickUseStats && (
					<QuickUseSection
						flavorText={item.flavorText}
						quickUse={item.quickUse}
						charge={quickUseCharge}
					/>
				)}

				{/* Gear Section */}
				{gearStats && gearType && <GearSection stats={gearStats} type={gearType} />}

				{/* Recycling Section */}
				{recyclingRecipe && (
					<RecyclingSection outputItem={item} recyclingRecipe={recyclingRecipe} />
				)}

				{/* Sources Section (with two columns) */}
				{recyclingSources.length > 0 && (
					<SourcesSection item={item} recyclingSources={recyclingSources} />
				)}

				{/* TODO: Recipe Section */}
				{/* TODO: Uses Section quests/workshop */}

				{/* Dev Tools */}
				{/* <DevTools item={item} /> */}
			</DialogContent>
		</Dialog>
	);
}
