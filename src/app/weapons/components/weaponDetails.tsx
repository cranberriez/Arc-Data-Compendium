import { Weapon } from "@/types";
import { formatName, toRomanNumeral } from "@/utils/format";
import { StatBar } from "./statBar";
import React from "react";

export function WeaponDetailsPanel({ weapon }: { weapon: Weapon }) {
	// Damage, Firerate, Health, Shield Health, Shield Negation
	const weaponData = weapon.weapon;
	if (!weaponData) return null; // item is not a weapon

	const weaponStats = weaponData.weaponStats;
	if (!weaponStats) return null; // weapon has no stats

	const statFilters = ["damage", "fireRate", "range", "stability", "agility", "stealth"];

	const upgradeStats = weaponData.upgrades?.sort((a, b) => a.level - b.level);

	console.log(upgradeStats);
	return (
		<div className="flex flex-col gap-4 bg-card border-1 p-3 rounded-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
			<div className="flex items-center justify-center p-2 border-amber-500 bg-amber-500/10 text-primary/90 border-2 rounded-lg">
				Stats are probably incorrect
			</div>

			<h2 className="text-2xl font-bold tracking-tight">{weapon.name}</h2>
			<div className="text-sm text-muted-foreground">
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

			<h3 className="text-base font-semibold">Base Stats</h3>
			<div>
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

			<div className="pt-3 border-t border-border/50 text-sm space-y-1">
				<p className="font-semibold">Upgrades:</p>
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
