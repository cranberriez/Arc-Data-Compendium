"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatName, getRarityColor, getTypeIcon } from "@/data/items/itemUtils";

import { cn } from "@/lib/utils";
import { ArrowRight, Book } from "lucide-react";
import { BaseItem } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { useDialog } from "@/contexts/dialogContext";
import { Button } from "@/components/ui/button";
import { ItemCard } from "./itemDisplay";

type ItemDialogProps = {
	data: BaseItem;
	isOpen: boolean;
	closeDialog: () => void;
};

export function ItemDialog({ data, isOpen, closeDialog }: ItemDialogProps) {
	// Move hooks to the top level
	const { getItemById, dialogQueue, setDialogQueue } = useItems();
	const { openDialog } = useDialog();

	if (!data) return null;
	const item = data;
	const ItemIcon = item.icon;

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
			<DialogContent className="w-[95vw] max-w-lg max-h-[95vh]">
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
					Details for {item.name}, {formatName(item.rarity)} {formatName(item.category)}
					{item.recipe ? ", Recipe" : ""}
				</DialogDescription>
				{/* Dialog Header */}
				<DialogHeader className="flex flex-row items-center gap-4">
					<div
						className={cn(
							"flex items-center justify-center rounded-lg w-16 h-16 border-2 p-2",
							getRarityColor(item.rarity, "border"),
							getRarityColor(item.rarity, "text")
						)}
					>
						{ItemIcon && <ItemIcon className="w-10 h-10" />}
					</div>
					<div className="flex flex-col items-start">
						<DialogTitle className="text-2xl font-mono font-light">
							{item.name}
						</DialogTitle>
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1">
									<div className="flex items-center w-fit h-fit">
										{React.createElement(getTypeIcon(item.category), {
											size: 12,
										})}
									</div>
									<p className="text-sm text-muted-foreground">
										{formatName(item.category)}
									</p>
								</div>
								<div className="flex items-center gap-1">
									<div
										className={cn(
											"w-3 h-3 rounded-full",
											getRarityColor(item.rarity, "bg")
										)}
									/>
									<p className="text-sm text-muted-foreground">
										{formatName(item.rarity)}
									</p>
								</div>

								{item.recipe && (
									<div className="flex items-center gap-1">
										<div className="w-fit h-fit">
											<Book size={12} />
										</div>
										<p className="text-sm text-muted-foreground">Craftable</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</DialogHeader>

				<hr className="my-2 border-t border-t-secondary-foreground/20 dark:border-t-secondary-foreground/10" />

				{item.recycling && item.recycling.length > 0 && (
					<div>
						<p className="font-mono font-light mb-2">Recycles Into:</p>
						<div className="flex flex-row items-center gap-2">
							{item.recycling.map((recycle, idx) => {
								const recycledItem = getItemById(recycle.id);
								if (!recycledItem) return null;
								return (
									<ItemCard
										key={recycle.id + idx}
										item={recycledItem}
										variant="icon"
										count={recycle.count}
										onClick={() => {
											setDialogQueue((prev) => [...prev, item]);
											openDialog("item", recycledItem);
										}}
									/>
								);
							})}
						</div>
					</div>
				)}

				{item.sources && item.sources.length > 0 && (
					<div>
						<p className="font-mono font-light mb-2">Sources:</p>
						{/* <div className="flex flex-col items-start gap-2 max-h-[250px] w-full overflow-y-scroll pb-6"> */}
						<div className="flex flex-col items-start gap-2">
							{[...item.sources]
								.filter((source) => source.type !== "buy")
								.sort((a, b) => (b.count || 0) - (a.count || 0))
								.map((source) => {
									const sourceItem = getItemById(source.fromItemId);
									if (!sourceItem) return null;

									// Get recycle products for this sourceItem
									const recycleProducts = (sourceItem.recycling || [])
										.map((recycle) => getItemById(recycle.id))
										.filter(Boolean);

									return (
										<div
											key={sourceItem.id}
											className="flex flex-row items-center gap-2"
										>
											<ItemCard
												item={sourceItem}
												variant="icon"
												// count={source.count}
												onClick={() => {
													setDialogQueue((prev) => [...prev, item]);
													openDialog("item", sourceItem);
												}}
											/>

											<ArrowRight className="size-4" />

											<ItemCard
												item={item}
												variant="icon"
												onClick={() => {}}
												count={source.count}
											/>

											{recycleProducts.length > 0 && (
												<div className="flex flex-row items-center gap-1 ml-2">
													{recycleProducts.map((recycledItem) => {
														if (!recycledItem) return null;
														if (recycledItem.id === item.id)
															return null;
														return (
															<ItemCard
																key={recycledItem.id}
																item={recycledItem}
																variant="icon"
																count={source.count}
																onClick={() => {
																	setDialogQueue((prev) => [
																		...prev,
																		item,
																	]);
																	openDialog(
																		"item",
																		recycledItem
																	);
																}}
															/>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
						</div>
					</div>
				)}

				{/* TODO: Add Sell Value, Buy Value, Recycle Value */}
				{/* TODO: Add Sources */}
				{/* TODO: Add Recycling if applicable */}
				{/* TODO: Add Recipe if applicable */}

				{/* DONE: Add raw item data for debugging */}
				<div className="max-h-[400px] w-fit overflow-y-scroll">
					<pre>{JSON.stringify(item, null, 2)}</pre>
				</div>
			</DialogContent>
		</Dialog>
	);
}
