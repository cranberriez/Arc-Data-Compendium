"use client";

import React, { useState } from "react";
import { Weapon } from "@/types";

import { WeaponGroup } from "./weaponGroup";
import { WeaponSelectionContext } from "./weaponSelectionContext";
import { StatsContainer } from "./stats/statsContainer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { WeaponSelectionBar } from "./weaponSelectionBar";
import { cn } from "@/lib/utils";

export function WeaponClient({ weapons }: { weapons: Weapon[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Initialize state from query param on first render, if query param exists
	const initialId = searchParams.get("id") || null;
	const [selectedId, setSelectedId] = useState<string | null>(initialId);
	const [showStats, setShowStats] = useState(false);

	// Create function to modify selectedId state and query param asynchronously
	const handleSelect = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id && id !== selectedId) {
			setSelectedId(id);
			params.set("id", id);
		} else {
			setSelectedId(null);
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
			<div className={cn("flex flex-col gap-4 flex-1 relative")}>
				{/* Selected Weapon bar and selection dropdown */}
				<WeaponSelectionBar
					selectedWeapon={selectedWeapon}
					showStats={showStats}
					setShowStats={setShowStats}
				/>

				{/* Weapon List */}
				{!showStats && (
					<div
						key="weapon-list"
						className="flex flex-col gap-4 w-full flex-1 rounded-l-xl sm:pr-2"
					>
						{weaponGroups().map(([weaponClass, list]) => (
							<WeaponGroup
								key={weaponClass}
								weaponClass={weaponClass}
								list={list}
							/>
						))}
					</div>
				)}

				{/* Stats Section */}
				{showStats && (
					<div className="flex flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
						<StatsContainer weapon={selectedWeapon} />
					</div>
				)}
			</div>
		</WeaponSelectionContext.Provider>
	);
}
