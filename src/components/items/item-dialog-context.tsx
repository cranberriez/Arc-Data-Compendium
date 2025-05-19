"use client";

import * as React from "react";
import type { BaseItem } from "@/types/items/base";
import { ItemDialog } from "./item-dialog";

interface ItemDialogContextType {
	isOpen: boolean;
	item: BaseItem | null;
	openDialog: (item: BaseItem) => void;
	closeDialog: () => void;
}

const ItemDialogContext = React.createContext<ItemDialogContextType | undefined>(undefined);

export function ItemDialogProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [currentItem, setCurrentItem] = React.useState<BaseItem | null>(null);

	const openDialog = React.useCallback((item: BaseItem) => {
		setCurrentItem(item);
		setIsOpen(true);
	}, []);

	const closeDialog = React.useCallback(() => {
		setIsOpen(false);
		// Small delay before clearing the item to allow for animations
		setTimeout(() => setCurrentItem(null), 200);
	}, []);

	const value = React.useMemo(
		() => ({
			isOpen,
			item: currentItem,
			openDialog,
			closeDialog,
		}),
		[isOpen, currentItem, openDialog, closeDialog]
	);

	return (
		<ItemDialogContext.Provider value={value}>
			{children}
			<ItemDialog />
		</ItemDialogContext.Provider>
	);
}

export function useItemDialog() {
	const context = React.useContext(ItemDialogContext);
	if (context === undefined) {
		throw new Error("useItemDialog must be used within an ItemDialogProvider");
	}
	return context;
}
