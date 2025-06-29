"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Weapon } from "@/types";
import { Card } from "@/components/ui/card";
import { TTKShieldSelector } from "./shieldSelector";
import { WeaponDetailsPanel } from "./weaponDetails";
import { WeaponCard } from "./weaponCard";
import { formatName } from "@/utils/format";

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
