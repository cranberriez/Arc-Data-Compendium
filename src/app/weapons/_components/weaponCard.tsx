"use client";

import { formatName } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Weapon } from "@/types";
import { AMMO_TYPE_COLORS } from "@/utils/weapons/shieldValues";
import { useWeaponSelection } from "./weaponSelectionContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WeaponImage } from "./weaponImage";
import { getRarityColor } from "@/utils/items/itemUtils";

export function WeaponCard({ weapon }: { weapon: Weapon }) {
	const { selectedId, setSelectedId } = useWeaponSelection();
	const ammoType = weapon.weapon?.ammoType;
	const rarity = weapon.rarity;
	const rarityColor = getRarityColor(rarity, "text");
	const rarityBgColor = `${getRarityColor(rarity, "bg")}/10`;

	const selected = weapon.id === selectedId;

	const handleClick = () => {
		setSelectedId(weapon.id);
	};

	return (
		<div
			className={cn(
				"flex flex-wrap items-stretch gap-2 p-2 border-2 rounded-lg cursor-pointer bg-card hover:border-blue-500/60 hover:border-dashed hover:shadow-sm",
				selected && "border-blue-500/60 border-solid!"
			)}
			onClick={handleClick}
		>
			<WeaponImage
				name={weapon.name}
				rarity={weapon.rarity}
				className="aspect-video min-w-16 w-[30%] max-w-32 border-0"
				gradientClasses="opacity-30"
			/>
			<div className="flex flex-col justify-end flex-1 gap-2">
				<h3 className="text-lg lg:text-xl">{formatName(weapon.name)}</h3>
				<div className="flex items-center gap-2">
					<WeaponBadge
						text={weapon.rarity}
						color={rarityColor}
						tooltipText={"Rarity: " + formatName(weapon.rarity)}
						className={rarityBgColor}
					/>
					{ammoType && (
						<WeaponBadge
							text={ammoType[0]}
							color={AMMO_TYPE_COLORS[ammoType || "none"]}
							tooltipText={"Ammo Type: " + formatName(ammoType)}
						/>
					)}
				</div>
			</div>
			<BasicWeaponStats weapon={weapon} />
		</div>
	);
}

function BasicWeaponStats({ weapon }: { weapon: Weapon }) {
	const weaponData = weapon.weapon;
	if (!weaponData || !weaponData.statsBase) return null;
	const weaponStats = weaponData.statsBase;

	const { damage = 0, fire_rate = 0, range = 0 } = weaponStats;

	return (
		<div className="flex flex-col items-center justify-between h-full max-h-24 w-24 min-w-fit">
			<BasicStatItem label="Damage" stat={damage} />
			<BasicStatItem label="Fire Rate" stat={fire_rate} />
			<BasicStatItem label="Range" stat={range} />
		</div>
	);
}

function BasicStatItem({ label, stat }: { label: string; stat: number | null }) {
	const statValue = stat?.toFixed(0).toString() || "0";

	return (
		<div className="flex items-center gap-1 w-full h-full">
			<p className="text-sm text-muted-foreground w-2/3">{label}</p>
			<p className="text-sm w-1/3 text-center">{statValue}</p>
		</div>
	);
}

function WeaponBadge({
	text,
	color,
	tooltipText,
	className,
	style,
}: {
	text: string;
	color: string;
	tooltipText: string;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<Tooltip>
			<TooltipTrigger>
				<div
					className={cn(
						"flex items-center justify-center px-2 min-w-6 h-6 text-xs uppercase rounded-md",
						color,
						className
					)}
					style={style}
				>
					{text}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{tooltipText}</p>
			</TooltipContent>
		</Tooltip>
	);
}
