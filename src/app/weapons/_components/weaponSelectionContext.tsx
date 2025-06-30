import { createContext, useContext, Dispatch, SetStateAction } from "react";
export const WeaponSelectionContext = createContext<{
	selectedId: string | null;
	setSelectedId: Dispatch<SetStateAction<string | null>>;
}>(null!);

export const useWeaponSelection = () => useContext(WeaponSelectionContext);
