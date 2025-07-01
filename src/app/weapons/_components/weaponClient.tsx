"use client";

import React, { useState } from "react";
import { Weapon } from "@/types";

import { WeaponGroup } from "./weaponGroup";
import { WeaponSelectionContext } from "./weaponSelectionContext";
import { StatsContainer } from "./stats/statsContainer";

export function WeaponClient({ weapons }: { weapons: Weapon[] }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const selectedWeapon: Weapon | null = weapons.find((w) => w.id === selectedId) ?? null;

	const weaponGroups = () => {
		const map: Record<string, Weapon[]> = {};
		weapons.forEach((w) => {
			const weaponData = w.weapon;
			if (!weaponData) return;
			const weaponClass = weaponData.weaponClass!;

			if (!map[weaponClass]) map[weaponClass] = [];
			map[weaponClass].push(w);
		});
		return map;
	};

	return (
		<WeaponSelectionContext.Provider value={{ selectedId, setSelectedId }}>
			<div className="flex flex-1">
				{/* Weapon List */}
				<div className="flex flex-col gap-4 w-full min-w-[200px] sm:max-w-xs flex-1 rounded-l-xl overflow-y-auto max-h-[calc(100vh-4rem)] sm:pr-2">
					{Object.entries(weaponGroups()).map(([weaponClass, list]) => (
						<WeaponGroup
							key={weaponClass}
							weaponClass={weaponClass}
							list={list}
						/>
					))}
				</div>

				{/* Stats Section */}
				<div className="hidden sm:flex flex-1 min-w-fit overflow-y-auto max-h-[calc(100vh-4rem)]">
					<StatsContainer weapon={selectedWeapon} />
				</div>
			</div>
		</WeaponSelectionContext.Provider>
	);
}
