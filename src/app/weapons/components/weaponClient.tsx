"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Weapon, WeaponBase } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toRomanNumeral, formatName } from "@/utils/format";
import { calculateTTK } from "@/utils/weapons/ttkCalc";

// Stat max values for creating the horizontal bars representing the stat
const STAT_MAX_VALUES: Record<string, number> = {
	damage: 200,
	fire_rate: 100,
	range: 150,
	stability: 100,
	agility: 100,
	stealth: 100,
};

// Shield Values for Selection
type Shield_Data = Record<string, { health: number; negationPercent: number; color: string }>;

const SHIELD_VALUES: Shield_Data = {
	none: { health: 0, negationPercent: 0, color: "bg-common" },
	light: { health: 50, negationPercent: 0.23, color: "bg-uncommon" },
	medium: { health: 80, negationPercent: 0.45, color: "bg-rare" },
	heavy: { health: 120, negationPercent: 0.65, color: "bg-epic" },
};

const AMMO_TYPE_COLORS: Record<string, string> = {
	light: "bg-amber-200 text-amber-900 dark:bg-transparent dark:text-amber-400",
	medium: "bg-blue-200 text-blue-900 dark:bg-transparent dark:text-blue-300",
	heavy: "bg-rose-200 text-rose-900 dark:bg-transparent dark:text-rose-300",
	shotgun: "bg-red-200 text-red-900 dark:bg-transparent dark:text-red-400",
	energy: "bg-green-200 text-green-900 dark:bg-transparent dark:text-green-300",
};

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

export function WeaponsClient({ weapons }: { weapons: Weapon[] }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isLocked, setIsLocked] = useState(false);
	const [shield, setShield] = useState<string>("light");

	useEffect(() => {
		if (weapons.length) setSelectedId(weapons[0].id);
	}, [weapons]);

	const selectedWeapon = useMemo(
		() => weapons.find((w) => w.id === selectedId) || null,
		[selectedId, weapons]
	);

	const weaponGroups = useMemo(() => {
		const map: Record<string, Weapon[]> = {};
		weapons.forEach((w) => {
			const weaponData = w.weapon;
			if (!weaponData) return;
			const weaponClass = weaponData.weaponClass!;

			if (!map[weaponClass]) map[weaponClass] = [];
			map[weaponClass].push(w);
		});
		return map;
	}, [weapons]);

	const handleHover = (weapon: Weapon) => {
		if (!isLocked) setSelectedId(weapon.id);
	};

	const handleClick = (weapon: Weapon) => {
		if (isLocked && weapon.id === selectedId) {
			setIsLocked(false);
		} else {
			setSelectedId(weapon.id);
			setIsLocked(true);
		}
	};

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
				{/* <h1 className="text-2xl text-center font-bold">Weapons</h1> */}
				<div className="flex lg:gap-6">
					<div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
						{Object.entries(weaponGroups).map(([weaponClass, list]) =>
							list.length ? (
								<React.Fragment key={weaponClass}>
									<h2 className="font-semibold text-xl col-span-full">
										{formatName(weaponClass)}
									</h2>
									{list.map((weapon) => (
										<WeaponCard
											key={weapon.id}
											weapon={weapon}
											selected={weapon.id === selectedId}
											onHover={() => handleHover(weapon)}
											onClick={() => handleClick(weapon)}
											isLocked={isLocked}
											shield={shield}
										/>
									))}
								</React.Fragment>
							) : null
						)}
					</div>

					<div className="hidden lg:flex flex-col gap-2 w-72 sticky top-4 self-start">
						{selectedWeapon ? (
							<WeaponDetailsPanel weapon={selectedWeapon} />
						) : (
							<Card className="p-4 h-96 flex items-center justify-center text-muted-foreground">
								Select a weapon to see details
							</Card>
						)}

						<TTKShieldSelector
							shield={shield}
							setShield={setShield}
						/>
					</div>
				</div>
			</div>
		</article>
	);
}

function WeaponCard({
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

function StatBar({ label, value, maxValue }: { label: string; value: number; maxValue?: number }) {
	const max = maxValue || STAT_MAX_VALUES[label.toLowerCase().replace(/ /g, "_")] || 100;
	const percentage = (value / max) * 100;
	return (
		<div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-0.5">
			<span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
			<span className="text-sm font-medium justify-self-end tabular-nums">{value}</span>
			<div className="col-span-2">
				<Progress
					value={percentage}
					className="h-2 bg-muted/50"
				/>
			</div>
		</div>
	);
}

function WeaponDetailsPanel({ weapon }: { weapon: Weapon }) {
	// Damage, Firerate, Health, Shield Health, Shield Negation
	const weaponData = weapon.weapon;
	if (!weaponData) return null; // item is not a weapon

	const weaponStats = weaponData.weaponStats;
	if (!weaponStats) return null; // weapon has no stats

	const statFilters = ["damage", "fireRate", "range", "stability", "agility", "stealth"];

	const upgradeStats = weaponData.upgrades?.sort((a, b) => a.level - b.level);

	console.log(upgradeStats);
	return (
		<div className="bg-card border-1 p-3 rounded-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
			<div className="flex items-center justify-center mt-4 p-2 border-amber-500 bg-amber-500/10 text-primary/90 border-2 rounded-lg">
				Stats are probably incorrect
			</div>

			<h2 className="text-2xl font-bold mb-1 tracking-tight">{weapon.name}</h2>
			<div className="text-sm text-muted-foreground space-y-0.5 mb-3">
				<div>
					Class:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weaponData.weaponClass!)}
					</span>
				</div>
				<div>
					Ammo:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weaponData.ammoType!)}
					</span>
				</div>
				<div>
					Base Tier:{" "}
					<span className="font-medium text-foreground/90">
						{toRomanNumeral(weaponData.baseTier!)}
					</span>
				</div>
				<div>
					Max Level:{" "}
					<span className="font-medium text-foreground/90">{weaponData.maxLevel!}</span>
				</div>
			</div>

			<h3 className="mt-4 mb-2 text-base font-semibold">Base Stats</h3>
			<div className="space-y-2.5">
				{Object.entries(weaponStats)
					.filter(([key]) => statFilters.includes(key))
					.map(([key, value]) => (
						<StatBar
							key={key}
							label={formatName(key)}
							value={value as number}
						/>
					))}
			</div>

			<div className="mt-4 pt-3 border-t border-border/50 text-sm space-y-1">
				<p className="font-semibold mb-2">Upgrades:</p>
				{upgradeStats
					? upgradeStats.map((upgrade, index) => {
							return (
								<div
									key={upgrade.id}
									className="flex flex-col gap-2"
								>
									<div className="flex items-center gap-1">
										<p>Lvl {upgrade.level}</p>
										<div className="grid grid-cols-[1fr_1fr] gap-1 flex-1">
											{upgrade.upgradeStats?.map((stat) => (
												<React.Fragment key={stat.statType}>
													<p className="text-xs text-muted-foreground text-right pr-2">
														{formatName(stat.statType!)}
													</p>
													<p className="font-mono">
														{stat.value > 0 ? "+" : ""}
														{(stat.value * 100).toFixed(0)}{" "}
														<span className="text-xs text-muted-foreground">
															%
														</span>
													</p>
												</React.Fragment>
											))}
										</div>
									</div>
									{index < upgradeStats.length - 1 && (
										<div className="w-full h-[1px] bg-border/50" />
									)}
								</div>
							);
					  })
					: "No upgrades"}
			</div>
		</div>
	);
}

function TTKShieldSelector({
	shield,
	setShield,
}: {
	shield: string;
	setShield: (shield: string) => void;
}) {
	const shieldButton = (shield: string, isCurrent: boolean) => {
		const shieldData = SHIELD_VALUES[shield];

		return (
			<div
				className={cn(
					"px-2 py-1 flex items-center gap-1 cursor-pointer transition-all",
					isCurrent && "dark:bg-primary/20 bg-primary/10 rounded-sm"
				)}
				onClick={() => setShield(shield)}
			>
				<div className={cn("w-2 h-2 rounded-[2px] mb-[2px]", shieldData.color)} />
				<span className="mb-1 text-sm">{formatName(shield)}</span>
			</div>
		);
	};

	return (
		<div className="w-full flex justify-between bg-card border-1 p-1 rounded-lg">
			{shieldButton("none", shield === "none")}
			{shieldButton("light", shield === "light")}
			{shieldButton("medium", shield === "medium")}
			{shieldButton("heavy", shield === "heavy")}
		</div>
	);
}
