import { createContext, useContext } from "react";
export const WeaponSelectionContext = createContext<{
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
}>(null!);

export const useWeaponSelection = () => useContext(WeaponSelectionContext);
