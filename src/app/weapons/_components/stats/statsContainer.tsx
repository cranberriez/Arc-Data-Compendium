import { Weapon } from "@/types";
import { WeaponImage } from "../weaponImage";
import { BasicInfo } from "./basicInfo";
import { formatName } from "@/utils/format";

export function StatsContainer({ weapon }: { weapon: Weapon | null }) {
	if (!weapon) return null;

	const weaponData = weapon.weapon;
	if (!weaponData) return null;

	return (
		<div className="w-full h-full flex flex-col gap-4 sm:p-2">
			<div className="flex flex-row flex-wrap gap-2">
				<WeaponImage
					name={weapon.name}
					className="aspect-video w-full sm:w-1/3 sm:min-w-sm sm:max-w-xl"
					rarity={weapon.rarity}
				/>
				<BasicInfo
					name={weapon.name}
					description={weapon.description}
					rarity={weapon.rarity}
					ammoType={weaponData.ammoType ?? null}
					weaponClass={weaponData.weaponClass ?? null}
				/>
			</div>
			<StatsBreakdown weapon={weapon} />
		</div>
	);
}

function StatsBreakdown({ weapon }: { weapon: Weapon | null }) {
	if (!weapon) return null;

	const weaponData = weapon.weapon;
	if (!weaponData) return null;

	const weaponStats = weaponData.weaponStats;
	if (!weaponStats) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-semibold">Stats Breakdown</h2>
			<div className="flex flex-col gap-2 w-fit">
				{Object.entries(weaponStats).map(([key, value]) => (
					<StatItem
						key={key}
						label={key}
						stat={value as number | null}
					/>
				))}
			</div>
		</div>
	);
}

function StatItem({ label, stat }: { label: string; stat: number | null }) {
	if (label === "weaponId" || label === "statUsage") return null;

	const statValue = (stat || 0).toFixed(0);
	const statLabel = formatName(label);

	return (
		<div className="grid grid-cols-2 gap-2 flex-1 w-full">
			<p className="text-base text-muted-foreground">{statLabel}</p>
			<p className="text-base font-mono text-center">{statValue}</p>
		</div>
	);
}
