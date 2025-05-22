"use client";

import * as React from "react";
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
	setDialogQueue: React.Dispatch<React.SetStateAction<Item[]>>;
}

import { ItemDialog } from "../components/items/itemDialog";

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const dialogComponentMap: Record<string, React.ComponentType<any>> = {
	item: ItemDialog,
	// Add more dialog types and components here
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
	const [dialogQueue, setDialogQueue] = React.useState<Item[]>([]);
	const [state, setState] = React.useState<DialogState>({
		open: false,
		type: null,
		data: null,
	});

	const openDialog = React.useCallback((type: string, data: any) => {
		setState({ open: true, type, data });
		console.log(data);
	}, []);

	const closeDialog = React.useCallback(() => {
		setState((prev) => ({ ...prev, open: false }));
		setTimeout(() => {
			setState({ open: false, type: null, data: null });
		}, 200);
	}, []);

	const DialogComponent = state.type ? dialogComponentMap[state.type] : null;

	const value = React.useMemo(
		() => ({
			openDialog,
			closeDialog,
			dialogQueue,
			setDialogQueue,
		}),
		[openDialog, closeDialog, dialogQueue, setDialogQueue]
	);

	return (
		<DialogContext.Provider value={value}>
			{children}
			{state.open && DialogComponent && (
				<DialogComponent
					isOpen={state.open}
					data={state.data}
					closeDialog={closeDialog}
				/>
			)}
		</DialogContext.Provider>
	);
}

export function useDialog() {
	const context = React.useContext(DialogContext);
	if (!context) {
		throw new Error("useDialog must be used within a DialogProvider");
	}
	return context;
}
