"use client";

import React, { useState } from "react";
import { Weapon } from "@/types";

import { WeaponGroup } from "./weaponGroup";
import { WeaponSelectionContext } from "./weaponSelectionContext";

export function WeaponClient({ weapons }: { weapons: Weapon[] }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);

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

	console.log(JSON.stringify(weapons[0], null, 2));

	return (
		<WeaponSelectionContext value={{ selectedId, setSelectedId }}>
			<div className="flex flex-1">
				{/* Weapon List */}
				<div className="flex flex-col gap-4 w-full sm:w-3xs lg:w-sm rounded-l-xl overflow-y-auto max-h-[calc(100vh-4rem)] pr-2">
					{Object.entries(weaponGroups()).map(([weaponClass, list]) => (
						<WeaponGroup
							key={weaponClass}
							weaponClass={weaponClass}
							list={list}
						/>
					))}
				</div>

				{/* Stats Section */}
				<div className="flex-1 rounded-r-xl overflow-y-auto max-h-[calc(100vh-4rem)]">
					<pre></pre>
				</div>
			</div>
		</WeaponSelectionContext>
	);
}
