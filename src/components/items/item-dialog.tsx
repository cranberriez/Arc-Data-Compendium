"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatName, getRarityColor, getTypeIcon } from "@/data/items/types";
import { useItemDialog } from "./item-dialog-context";
import { cn } from "@/lib/utils";
import { Book } from "lucide-react";

export function ItemDialog() {
	const { isOpen, item, closeDialog } = useItemDialog();

	if (!item) return null;

	const rarityColor = getRarityColor(item.rarity);
	const ItemIcon = item.icon;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent className="w-[95vw] max-w-md">
				<DialogHeader className="flex flex-row items-center gap-4">
					<div
						className={
							"flex items-center justify-center rounded-lg w-16 h-16 border-2 p-2"
						}
					>
						{ItemIcon && <ItemIcon className={`w-10 h-10 ${rarityColor}`} />}
					</div>
					<DialogTitle className="text-2xl font-mono font-light whitespace-nowrap">
						{item.display_name}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<div className="w-fit h-fit">
								{getTypeIcon(item.type, { size: 12 })}
							</div>
							<p className="text-sm text-muted-foreground">{formatName(item.type)}</p>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-3 h-3 rounded-full"></div>
							<p className="text-sm text-muted-foreground">
								{formatName(item.rarity)}
							</p>
						</div>

						{item.craftable && (
							<div className="flex items-center gap-1">
								<div className="w-fit h-fit">
									<Book size={12} />
								</div>
								<p className="text-sm text-muted-foreground">Craftable</p>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
