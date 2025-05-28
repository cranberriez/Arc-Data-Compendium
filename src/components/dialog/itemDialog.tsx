"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { Button } from "@/components/ui/button";
import { ItemHeader, RecyclingSection, SourcesSection, QuickUseSection, GearSection } from ".";

type ItemDialogProps = {
	data: Item;
	isOpen: boolean;
	closeDialog: () => void;
	backDialog: () => void;
};

export function ItemDialog({ data, isOpen, closeDialog, backDialog }: ItemDialogProps) {
	const { dialogQueue } = useDialog();

	if (!data) return null;
	const item = data;

	const sourcesPresent = item.sources && item.sources.length > 0;
	const recyclingPresent = item.recycling && item.recycling.length > 0;
	const isQuickUse = item.quickUse;
	const isGear = item.gear;

	// Custom close handler to clear the queue
	const handleCloseDialog = () => {
		closeDialog();
	};

	// Back navigation
	const handleBack = () => {
		backDialog();
	};

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

				{/* Screen Reader Stuff */}
				<DialogDescription className="sr-only">
					Details for {item.name}, {item.rarity} {item.category}
					{item.recipeId ? ", Recipe" : ""}
				</DialogDescription>

				<DialogDescription>{item.description}</DialogDescription>

				{sourcesPresent || recyclingPresent || isQuickUse || isGear ? (
					<hr className="my-2 border-t border-t-secondary-foreground/20 dark:border-t-secondary-foreground/10" />
				) : null}

				{/* Quick Use Section */}
				{isQuickUse && <QuickUseSection item={item} />}

				{/* Gear Section */}
				{isGear && <GearSection item={item} />}

				{/* Recycling Section */}
				{recyclingPresent && <RecyclingSection item={item} />}

				{/* Sources Section (with two columns) */}
				{sourcesPresent && <SourcesSection item={item} />}
			</DialogContent>
		</Dialog>
	);
}
