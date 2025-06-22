"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { Button } from "@/components/ui/button";
import { ItemHeader, RecyclingSection, SourcesSection, QuickUseSection, GearSection } from ".";
import DevTools from "./diagDevTools";
import DiagDescription from "./diagDescription";
import { useRecipes } from "@/contexts/recipeContext";

type ItemDialogProps = {
	data: Item;
	isOpen: boolean;
	closeDialog: () => void;
	backDialog: () => void;
};

export function ItemDialog({ data, isOpen, closeDialog, backDialog }: ItemDialogProps) {
	const { dialogQueue } = useDialog();
	const { getRecyclingSourcesById } = useRecipes();

	if (!data) return null;
	const item = data;

	// Custom close handler to clear the queue
	const handleCloseDialog = () => {
		closeDialog();
	};

	// Back navigation
	const handleBack = () => {
		backDialog();
	};

	const quickUseStats = item.quickUse?.stats;
	const quickUseCharge = item.quickUse?.charge;
	const gearStats = item.gear?.stats;
	const gearType = item.gear?.category;
	const recyclingRecipe = item.recycling;
	const recyclingSources = getRecyclingSourcesById(item.id);
	console.log(recyclingSources);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && handleCloseDialog()}
		>
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
				<ItemHeader item={item} />

				<DiagDescription item={item} />

				{quickUseStats || quickUseCharge || gearStats || gearType || recyclingRecipe ? (
					<hr className="my-2 border-t border-t-secondary-foreground/20 dark:border-t-secondary-foreground/10" />
				) : null}

				{/* Quick Use Section */}
				{quickUseStats && quickUseCharge && (
					<QuickUseSection
						flavorText={item.flavorText}
						stats={quickUseStats}
						charge={quickUseCharge}
					/>
				)}

				{/* Gear Section */}
				{gearStats && gearType && (
					<GearSection
						stats={gearStats}
						type={gearType}
					/>
				)}

				{/* Recycling Section */}
				{recyclingRecipe && (
					<RecyclingSection
						outputItem={item}
						recyclingRecipe={recyclingRecipe}
					/>
				)}

				{/* Sources Section (with two columns) */}
				{recyclingSources.length > 0 && (
					<SourcesSection
						item={item}
						recyclingSources={recyclingSources}
					/>
				)}

				{/* TODO: Recipe Section */}
				{/* TODO: Uses Section quests/workshop */}

				{/* Dev Tools */}
				<DevTools item={item} />
			</DialogContent>
		</Dialog>
	);
}
