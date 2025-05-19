"use client";

import * as React from "react";

type DialogType = "item"; // Extend with more types as needed

interface DialogState {
	open: boolean;
	type: DialogType | null;
	data: any;
}

interface DialogContextType {
	openDialog: (type: DialogType, data: any) => void;
	closeDialog: () => void;
}

import { ItemDialog } from "../components/items/itemDialog";

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const dialogComponentMap: Record<DialogType, React.ComponentType<any>> = {
	item: ItemDialog,
	// Add more dialog types and components here
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = React.useState<DialogState>({
		open: false,
		type: null,
		data: null,
	});

	const openDialog = React.useCallback((type: DialogType, data: any) => {
		setState({ open: true, type, data });
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
		}),
		[openDialog, closeDialog]
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
