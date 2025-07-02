"use client";

import { formatName } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Weapon } from "@/types";
import { AMMO_TYPE_COLORS } from "@/utils/weapons/shieldValues";
import { useWeaponSelection } from "./weaponSelectionContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function WeaponCard({ weapon }: { weapon: Weapon }) {
	const { selectedId, setSelectedId } = useWeaponSelection();
	const ammoType = weapon.weapon?.ammoType;

	const selected = weapon.id === selectedId;

	const handleClick = () => {
		setSelectedId(weapon.id);
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between p-2 border-2 rounded-lg cursor-pointer hover:bg-card hover:border-blue-500/60 hover:border-dashed hover:shadow-sm",
				selected && "border-blue-500/60 border-solid!"
			)}
			onClick={handleClick}
		>
			<h3>{formatName(weapon.name)}</h3>
			{ammoType && (
				<Tooltip>
					<TooltipTrigger>
						<div
							className={cn(
								"flex items-center justify-center w-6 h-6 text-xs uppercase rounded-lg",
								AMMO_TYPE_COLORS[ammoType || "none"]
							)}
						>
							{ammoType[0]}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>{formatName(ammoType)} Ammo</p>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}
