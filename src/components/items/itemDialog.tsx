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
import { Book } from "lucide-react";

type ItemDialogProps = {
	data: any;
	isOpen: boolean;
	closeDialog: () => void;
};

export function ItemDialog({ data, isOpen, closeDialog }: ItemDialogProps) {
	if (!data) return null;
	const item = data;
	const ItemIcon = item.icon;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-y-scroll">
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
									<div className="w-fit h-fit">
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

				{/* TODO: Add Sell Value, Buy Value, Recycle Value */}
				{/* TODO: Add Sources */}
				{/* TODO: Add Recycling if applicable */}
				{/* TODO: Add Recipe if applicable */}

				{/* TODO: Add raw item data for debugging */}
				<div className="max-h-[200px] overflow-y-scroll">
					<pre>{JSON.stringify(item, null, 2)}</pre>
				</div>
			</DialogContent>
		</Dialog>
	);
}
