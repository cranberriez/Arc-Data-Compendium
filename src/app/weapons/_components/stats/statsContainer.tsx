import { Weapon } from "@/types";
import { cn } from "@/lib/utils";
import { WeaponImage } from "../weaponImage";
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
				<div className="flex-1 flex flex-col gap-4">
					<BasicInfo
						name={weapon.name}
						description={weapon.description}
						rarity={weapon.rarity}
						ammoType={weaponData.ammoType ?? null}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	);
}

function BasicInfo({
	name,
	description,
	rarity,
	ammoType,
	className,
}: {
	name: string;
	description: string | null;
	rarity: string;
	ammoType: string | null;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-4 bg-card p-4 rounded-lg", className)}>
			<h2 className="text-3xl font-semibold tracking-wide"> {name} </h2>
			<p> {description ?? "No description"} </p>
			<p> {ammoType ? formatName(ammoType) : "No ammo type"} </p>
			<p> {formatName(rarity)} </p>
		</div>
	);
}
