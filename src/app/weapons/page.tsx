"use client";

import { useEffect, useMemo, useState } from "react";
import { Weapon } from "@/types/items/weapon";
import { fetchWeapons } from "@/services/dataService";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toRomanNumeral } from "@/utils/format";
import { formatName } from "@/data/items/itemUtils";

const STAT_MAX_VALUES: Record<string, number> = {
	damage: 200, // Example max values, adjust as needed
	fire_rate: 1000,
	range: 150,
	stability: 100,
	agility: 100,
	stealth: 100,
};

export default function WeaponsPage() {
	const [weapons, setWeapons] = useState<Weapon[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isLocked, setIsLocked] = useState(false);

	useEffect(() => {
		fetchWeapons().then((data: Weapon[]) => {
			setWeapons(data);
			if (data.length) setSelectedId(data[0].id);
		});
	}, []);

	const selectedWeapon = useMemo(
		() => weapons.find((w) => w.id === selectedId) || null,
		[selectedId, weapons]
	);

	const weaponGroups = useMemo(() => {
		const map: Record<string, Weapon[]> = {};
		weapons.forEach((w) => {
			if (!map[w.weapon_class]) map[w.weapon_class] = [];
			map[w.weapon_class].push(w);
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
}: {
	weapon: Weapon;
	selected: boolean;
	onHover: () => void;
	onClick: () => void;
	isLocked: boolean;
}) {
	return (
		<Card
			className={cn(
				"cursor-pointer p-3 border-2 border-border/50 hover:border-primary/40 bg-card w-64 transition-colors duration-150 ease-out",
				selected && !isLocked && "border-primary bg-primary/5 shadow-md",
				isLocked && selected && "border-sky-500! shadow-lg"
			)}
			onMouseEnter={onHover}
			onClick={onClick}
		>
			<div className="flex items-center gap-2">
				{/* <span className="font-mono text-lg text-muted-foreground">
					{toRomanNumeral(weapon.base_tier)}
				</span> */}
				<h3 className="font-semibold text-xl leading-tight mb-1">{weapon.name}</h3>
				<div className="text-primary/90 ml-auto px-2 py-0.5 border rounded-full">
					TTK: 1.23s
				</div>
			</div>
			<div className="flex justify-between gap-2">
				<p className="text-muted-foreground">{formatName(weapon.weapon_class)}</p>
				<p className="text-muted-foreground">{formatName(weapon.ammo_type)}</p>
			</div>
		</Card>
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
			<h2 className="text-2xl font-bold mb-1 tracking-tight">{weapon.name}</h2>
			<div className="text-sm text-muted-foreground space-y-0.5 mb-3">
				<div>
					Class:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weapon.weapon_class)}
					</span>
				</div>
				<div>
					Ammo:{" "}
					<span className="font-medium text-foreground/90">
						{formatName(weapon.ammo_type)}
					</span>
				</div>
				<div>
					Base Tier:{" "}
					<span className="font-medium text-foreground/90">
						{toRomanNumeral(weapon.base_tier)}
					</span>
				</div>
				<div>
					Max Level:{" "}
					<span className="font-medium text-foreground/90">{weapon.max_level}</span>
				</div>
			</div>

			<h3 className="mt-4 mb-2 text-base font-semibold">Base Stats</h3>
			<div className="space-y-2.5">
				{Object.entries(weapon.stats)
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
							value={value}
						/>
					))}
			</div>

			<div className="mt-4 pt-3 border-t border-border/50 text-sm space-y-1">
				{Object.entries(weapon.stats)
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
							<span className="font-medium text-foreground/90">{value}</span>
						</div>
					))}
				<div>
					<span className="text-muted-foreground">Max Mods:</span>
					<span className="font-medium text-foreground/90">{weapon.max_mods}</span>
				</div>
			</div>
		</Card>
	);
}
