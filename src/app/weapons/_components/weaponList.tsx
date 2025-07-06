import { Weapon } from "@/types";
import { WeaponGroup } from "./weaponGroup";

export function WeaponList({
	visible,
	weaponGroups,
}: {
	visible: boolean;
	weaponGroups: () => [string, Weapon[]][];
}) {
	if (!visible) return null;
	return (
		<div
			key="weapon-list"
			className="flex flex-col gap-4 w-full flex-1 rounded-l-xl"
		>
			{weaponGroups().map(([weaponClass, list]) => (
				<WeaponGroup
					key={weaponClass}
					weaponClass={weaponClass}
					list={list}
				/>
			))}
		</div>
	);
}
