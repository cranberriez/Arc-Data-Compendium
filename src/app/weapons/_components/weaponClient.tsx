"use client";

import React, { useState } from "react";
import { Weapon } from "@/types";

import { WeaponGroup } from "./weaponGroup";
import { WeaponSelectionContext } from "./weaponSelectionContext";
import { StatsContainer } from "./stats/statsContainer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function WeaponClient({ weapons }: { weapons: Weapon[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Initialize state from query param on first render, if query param exists
	const initialId = searchParams.get("id") || null;
	const [selectedId, setSelectedId] = useState<string | null>(initialId);

	// Create function to modify selectedId state and query param asynchronously
	const handleSelect = (id: string | null) => {
		setSelectedId(id);
		const params = new URLSearchParams(searchParams.toString());
		if (id) {
			params.set("id", id);
		} else {
			params.delete("id");
		}
		router.replace(`?${params.toString()}`, { scroll: false }); // replace so history isn't polluted
	};

	// Acquire weapon object from passed weapons array
	const selectedWeapon: Weapon | null = weapons.find((w) => w.id === selectedId) ?? null;

	// Separate weapons into groups for rendering, useful for group collapse later
	const weaponClassOrder = [
		"assault_rifle",
		"battle_rifle",
		"smg",
		"shotgun",
		"pistol",
		"sniper_rifle",
		"light_machinegun",
		"special",
	];

	const weaponGroups = () => {
		const map: Record<string, Weapon[]> = {};
		weapons.forEach((w) => {
			const weaponData = w.weapon;
			if (!weaponData) return;
			const weaponClass = weaponData.weaponClass!;
			if (!map[weaponClass]) map[weaponClass] = [];
			map[weaponClass].push(w);
		});
		// Return ordered array of [weaponClass, Weapon[]]
		return weaponClassOrder
			.filter((weaponClass) => map[weaponClass])
			.map((weaponClass) => [weaponClass, map[weaponClass]] as [string, Weapon[]]);
	};

	return (
		<WeaponSelectionContext.Provider value={{ selectedId, setSelectedId: handleSelect }}>
			<div className="flex flex-1">
				{/* TODO: Selected Weapon bar and selection dropdown */}

				{/* Weapon List */}
				<div className="flex flex-col gap-4 w-full flex-1 rounded-l-xl sm:pr-2">
					{weaponGroups().map(([weaponClass, list]) => (
						<WeaponGroup
							key={weaponClass}
							weaponClass={weaponClass}
							list={list}
						/>
					))}
				</div>

				{/* Stats Section */}
				{/* <div className="hidden sm:flex flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
					<StatsContainer weapon={selectedWeapon} />
				</div> */}
			</div>
		</WeaponSelectionContext.Provider>
	);
}
