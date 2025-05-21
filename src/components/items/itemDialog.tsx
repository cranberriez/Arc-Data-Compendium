"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { Button } from "@/components/ui/button";
import { ItemHeader } from "./dialog/diagHeader";
import { RecyclingSection } from "./dialog/diagRecycling";
import { SourcesSection } from "./dialog/diagSource";

type ItemDialogProps = {
	data: Item;
	isOpen: boolean;
	closeDialog: () => void;
};

export function ItemDialog({ data, isOpen, closeDialog }: ItemDialogProps) {
	// Move hooks to the top level
	const { openDialog, dialogQueue, setDialogQueue } = useDialog();

	if (!data) return null;
	const item = data;

	const sourcesPresent = item.sources && item.sources.length > 0;
	const recyclingPresent = item.recycling && item.recycling.length > 0;

	// Custom close handler to clear the queue
	const handleCloseDialog = () => {
		setDialogQueue([]);
		closeDialog();
	};

	// Back navigation
	const handleBack = () => {
		const prevQueue = [...dialogQueue];
		const lastItem = prevQueue.pop();
		if (lastItem) {
			setDialogQueue(prevQueue);
			openDialog("item", lastItem);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && handleCloseDialog()}
		>
			<DialogContent>
				{/* Back buttons */}
				{dialogQueue.length > 0 && (
					<div>
						<Button
							variant="secondary"
							onClick={handleBack}
							className="px-3 py-1 cursor-pointer"
						>
							← Back to {dialogQueue[dialogQueue.length - 1].name}
						</Button>
					</div>
				)}
				{/* Screen Reader Stuff */}
				<DialogDescription className="sr-only">
					Details for {item.name}, {item.rarity} {item.category}
					{item.recipe ? ", Recipe" : ""}
				</DialogDescription>

				{/* Dialog Header */}
				<ItemHeader item={item} />

				{sourcesPresent || recyclingPresent ? (
					<hr className="my-2 border-t border-t-secondary-foreground/20 dark:border-t-secondary-foreground/10" />
				) : null}

				{/* Recycling Section */}
				{recyclingPresent && <RecyclingSection item={item} />}

				{/* Sources Section (with two columns) */}
				{sourcesPresent && <SourcesSection item={item} />}
			</DialogContent>
		</Dialog>
	);
}
