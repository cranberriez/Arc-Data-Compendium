"use client";

import React, { createContext, useState, useCallback, useMemo, useContext } from "react";
import { Item } from "@/types";

interface DialogState {
	open: boolean;
	type: string | null;
	data: any;
}

interface DialogContextType {
	openDialog: (type: string, data: any) => void;
	closeDialog: () => void;
	dialogQueue: Item[];
}

import { ItemDialog } from "../components/items/itemDialog";

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const dialogComponentMap: Record<string, React.ComponentType<any>> = {
	item: ItemDialog,
	// Add more dialog types and components here
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
	const [dialogQueue, setDialogQueue] = useState<Item[]>([]);
	const [state, setState] = useState<DialogState>({
		open: false,
		type: null,
		data: null,
	});

	const backDialog = useCallback(() => {
		if (dialogQueue.length > 0) {
			const lastItem = dialogQueue[dialogQueue.length - 1];
			setState((prevState) => ({
				open: true,
				type: prevState.type,
				data: lastItem,
			}));
			setDialogQueue((prev) => prev.slice(0, prev.length - 1));
		}
	}, [dialogQueue]);

	const openDialog = useCallback((type: string, data: any) => {
		setState((prevState) => {
			if (prevState.open && prevState.data) {
				console.log("Dialog already open, updating data");
				// Add previous data to queue before updating state
				setDialogQueue((prevQueue) => {
					// Remove any existing instance of this item from the queue
					const filteredQueue = prevQueue.filter(item => item.id !== prevState.data.id);
					// Add the item to the end of the queue
					return [...filteredQueue, prevState.data];
				});
			}
			return {
				open: true,
				type: type,
				data: data,
			};
		});
	}, []);

	const closeDialog = useCallback(() => {
		setState({
			open: false,
			type: null,
			data: null,
		});
		setDialogQueue([]);
	}, []);

	const DialogComponent = state.type ? dialogComponentMap[state.type] : null;

	const value = useMemo(
		() => ({
			openDialog,
			closeDialog,
			backDialog,
			dialogQueue,
		}),
		[openDialog, closeDialog, backDialog, dialogQueue]
	);

	return (
		<DialogContext.Provider value={value}>
			{children}
			{state.open && DialogComponent && (
				<DialogComponent
					isOpen={state.open}
					data={state.data}
					closeDialog={closeDialog}
					backDialog={backDialog}
				/>
			)}
		</DialogContext.Provider>
	);
}

export function useDialog() {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error("useDialog must be used within a DialogProvider");
	}
	return context;
}
