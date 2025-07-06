"use client";

import React, { useState } from "react";
import { Weapon } from "@/types";
import { WeaponSelectionContext } from "./weaponSelectionContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { WeaponSelectionBar } from "./weaponSelectionBar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatsPanel } from "./stats/statsPanel";
import { WeaponList } from "./weaponList";

export function WeaponClient({ weapons }: { weapons: Weapon[] }) {
	const isMobile = useIsMobile();
	const searchParams = useSearchParams();
	const router = useRouter();

	// Initialize state from query param on first render, if query param exists
	const initialId = searchParams.get("id") || null;
	const [selectedId, setSelectedId] = useState<string | null>(initialId);
	// Only used on mobile. On desktop, stats are always shown if a weapon is selected.
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

	// Always show selection bar if a weapon is selected
	const showSelectionBar = !!selectedId;

	// Compute mode for easier downstream logic
	// Modes: 'desktop-list', 'desktop-stats', 'mobile-list', 'mobile-stats'
	const mode = isMobile
		? showStats
			? "mobile-stats"
			: "mobile-list"
		: selectedWeapon
		? "desktop-stats"
		: "desktop-list";

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
				{showSelectionBar &&
					(isMobile ? (
						<WeaponSelectionBar
							selectedWeapon={selectedWeapon}
							setSelectedId={handleSelect}
							showStats={showStats}
							setShowStats={setShowStats}
							isMobile={true}
						/>
					) : (
						<WeaponSelectionBar
							selectedWeapon={selectedWeapon}
							setSelectedId={handleSelect}
							showStats={true}
							isMobile={false}
						/>
					))}

				<WeaponList
					visible={mode === "desktop-list" || mode === "mobile-list"}
					weaponGroups={weaponGroups}
				/>
				<StatsPanel
					visible={mode === "desktop-stats" || mode === "mobile-stats"}
					weapon={selectedWeapon}
				/>
			</div>
		</WeaponSelectionContext.Provider>
	);
}
