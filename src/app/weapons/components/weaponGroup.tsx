"use client";

import { Weapon } from "@/types";
import { formatName } from "@/utils/format";
import { WeaponCard } from "./weaponCard";

export function WeaponGroup({ weaponClass, list }: { weaponClass: string; list: Weapon[] }) {
	return (
		<div className="flex flex-col gap-2 p-2">
			<div className="flex items-center justify-center gap-2">
				<div className="flex-1 h-[2px] rounded-full bg-muted-foreground/20" />
				<h2 className="text-center text-sm uppercase font-semibold text-muted-foreground whitespace-nowrap">
					{formatName(weaponClass)}
				</h2>
				<div className="flex-1 h-[2px] rounded-full bg-muted-foreground/20" />
			</div>
			{list.map((weapon) => (
				<WeaponCard
					key={weapon.id}
					weapon={weapon}
				/>
			))}
		</div>
	);
}
