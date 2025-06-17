"use client";

import { useEffect, useMemo, useState } from "react";
import { Weapon } from "@/types";
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
	light: "text-amber-600 dark:text-amber-400",
	medium: "text-blue-600 dark:text-blue-300",
	heavy: "text-rose-600 dark:text-rose-300",
	shotgun: "text-red-800 dark:text-red-400",
	energy: "text-green-600 dark:text-green-300",
};

export function WeaponsClient({ weapons }: { weapons: Weapon[] }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isLocked, setIsLocked] = useState(false);
	const [shield, setShield] = useState<string | null>(null);

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
			if (!map[w.weaponClass!]) map[w.weaponClass!] = [];
			map[w.weaponClass!].push(w);
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
				<div className="flex gap-6">
					<div className="flex-1 space-y-6">
						{Object.entries(weaponGroups).map(([weaponClass, list]) =>
							list.length ? (
								<div
									key={weaponClass}
									className="space-y-3"
								>
									<h2 className="font-semibold text-xl">
										{formatName(weaponClass)} ({list.length})
									</h2>
									<div className="flex flex-wrap gap-3">
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
									</div>
								</div>
							) : null
						)}
					</div>

					<div className="hidden md:block w-96 sticky top-4 self-start">
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
	shield: string | null;
}) {
	// Damage, Firerate, Health, Shield Health, Shield Negation
	const ttk = calculateTTK(
		weapon.weaponStats.damage!,
		weapon.weaponStats.fireRate!,
		100,
		SHIELD_VALUES[shield || "none"].health,
		SHIELD_VALUES[shield || "none"].negationPercent
	);

	return (
		<div
			className={cn(
				"p-3 border-2 border-border/50 rounded-md w-64 transition-colors duration-150 ease-out gap-2 cursor-pointer hover:border-primary/40 bg-card",
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
						"text-muted-foreground text-shadow-md",
						AMMO_TYPE_COLORS[weapon.ammoType!],
						"light-text-shadow dark:no-light-text-shadow"
					)}
				>
					{formatName(weapon.ammoType!)}
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
	return (
		<Card className="p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
			<div className="flex items-center justify-center mt-4 p-2 border-amber-500 bg-amber-500/10 text-primary/90 border-2 rounded-lg">
				Stats are probably incorrect
			</div>

			<h2 className="text-2xl font-bold mb-1 tracking-tight">{weapon.name}</h2>
			<div className="text-sm text-muted-foreground space-y-0.5 mb-3">
				<div>
					Class:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weapon.weaponClass!)}
					</span>
				</div>
				<div>
					Ammo:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weapon.ammoType!)}
					</span>
				</div>
				<div>
					Base Tier:{" "}
					<span className="font-medium text-foreground/90">
						{toRomanNumeral(weapon.baseTier!)}
					</span>
				</div>
				<div>
					Max Level:{" "}
					<span className="font-medium text-foreground/90">{weapon.maxLevel}</span>
				</div>
			</div>

			<h3 className="mt-4 mb-2 text-base font-semibold">Base Stats</h3>
			<div className="space-y-2.5">
				{Object.entries(weapon.weaponStats)
					.filter(([key]) =>
						[
							"damage",
							"fire_rate",
							"range",
							"stability",
							"agility",
							"stealth",
						].includes(key)
					)
					.map(([key, value]) => (
						<StatBar
							key={key}
							label={formatName(key)}
							value={value as number}
						/>
					))}
			</div>

			<div className="mt-4 pt-3 border-t border-border/50 text-sm space-y-1">
				{Object.entries(weapon.upgrades)
					.filter(
						([key]) =>
							![
								"damage",
								"fire_rate",
								"range",
								"stability",
								"agility",
								"stealth",
							].includes(key)
					)
					.map(([key, value]) => (
						<div
							key={key}
							className="flex justify-between"
						>
							<span className="text-muted-foreground">{formatName(key)}:</span>
							<span className="font-medium text-foreground/90">
								{value.description}
							</span>
						</div>
					))}
			</div>
		</Card>
	);
}

function TTKShieldSelector({
	shield,
	setShield,
}: {
	shield: string | null;
	setShield: (shield: string | null) => void;
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
				<div className={cn("w-2 h-2 rounded-[2px]", shieldData.color)} />
				<span className="mb-1">{formatName(shield)}</span>
			</div>
		);
	};

	return (
		<div className="w-full flex justify-center gap-2 p-2">
			<div className="flex rounded-lg dark:bg-primary/10 bg-primary/5 p-1">
				{shieldButton("none", shield === "none")}
				{shieldButton("light", shield === "light")}
				{shieldButton("medium", shield === "medium")}
				{shieldButton("heavy", shield === "heavy")}
			</div>
		</div>
	);
}
