import { Weapon } from "@/types";
import { cn } from "@/lib/utils";
import { WeaponImage } from "../weaponImage";

export function StatsContainer({ weapon }: { weapon: Weapon | null }) {
	if (!weapon) return null;

	return (
		<div className="w-full h-full flex flex-col gap-4 p-4">
			<div className="flex flex-row flex-wrap gap-2">
				<WeaponImage
					name={weapon.name}
					className="aspect-video w-1/3 min-w-2xs max-w-lg"
					rarity={weapon.rarity}
				/>
				<div className="flex-1 flex flex-col gap-4">
					<BasicInfo
						name={weapon.name}
						description={weapon.description}
						rarity={weapon.rarity}
						ammoType={weapon.weapon?.ammoType!}
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
	ammoType: string;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-4 bg-card p-4 rounded-lg", className)}>
			<h2 className="text-3xl font-semibold tracking-wide"> {name} </h2>
			<p> {description ?? "No description"} </p>
		</div>
	);
}
