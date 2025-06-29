"use client";

import React from "react";
import { Weapon, WeaponBase } from "@/types";
import { cn } from "@/lib/utils";
import { formatName } from "@/utils/format";
import { calculateTTK } from "@/utils/weapons/ttkCalc";
import { AMMO_TYPE_COLORS, SHIELD_VALUES } from "@/utils/weapons/shieldValues";

const getWeaponDetails = (weapon: WeaponBase) => {
	return {
		weaponClass: weapon.weaponClass!,
		ammoType: weapon.ammoType!,
		baseTier: weapon.baseTier!,
		maxLevel: weapon.maxLevel!,
		modSlots: weapon.modSlots!,
		compatibleMods: weapon.compatibleMods!,
	};
};

export function WeaponCard({
	weapon,
	selected,
	onHover,
	onClick,
	isLocked,
	shield,
}: {
	weapon: Weapon;
	selected: boolean;
	onHover: () => void;
	onClick: () => void;
	isLocked: boolean;
	shield: string;
}) {
	// Damage, Firerate, Health, Shield Health, Shield Negation
	const weaponData = weapon.weapon;
	if (!weaponData) {
		console.log("weapon is not a weapon");
		return null;
	} // item is not a weapon

	const weaponStats = weaponData.weaponStats;
	if (!weaponStats) {
		console.log("weapon has no stats");
		return null;
	} // weapon has no stats

	const ttk = calculateTTK(
		weaponStats.damage!,
		weaponStats.fireRate!,
		100,
		SHIELD_VALUES[shield || "none"].health,
		SHIELD_VALUES[shield || "none"].negationPercent
	);

	const wepData = getWeaponDetails(weaponData);

	return (
		<div
			className={cn(
				"p-3 border-2 border-border/50 rounded-md min-w-64 transition-colors duration-150 ease-out gap-2 cursor-pointer hover:border-primary/40 bg-card",
				selected && !isLocked && "border-primary/75 shadow-md",
				isLocked && selected && "border-sky-500! shadow-lg"
			)}
			onMouseEnter={onHover}
			onClick={onClick}
		>
			<div className="flex items-center gap-2">
				{/* <span className="font-mono text-lg text-muted-foreground">
					{toRomanNumeral(weapon.base_tier)}
				</span> */}
				<h3 className="font-semibold text-lg leading-tight mb-1">{weapon.name}</h3>
				<div className="text-primary/90 ml-auto px-2 py-0.5 bg-primary/5 rounded text-sm">
					<span className="text-primary/60 mr-1">TTK</span>
					{ttk.timeToKillSeconds.toFixed(2)}s
				</div>
			</div>
			<div className="flex justify-between gap-2">
				{/* <p className="text-muted-foreground">{formatName(weapon.weapon_class)}</p> */}
				<p
					className={cn(
						"text-muted-foreground text-sm px-1 py-[1px] rounded",
						AMMO_TYPE_COLORS[wepData.ammoType!],
						"light-text-shadow dark:no-light-text-shadow"
					)}
				>
					{formatName(wepData.ammoType!)}
				</p>
			</div>
		</div>
	);
}
