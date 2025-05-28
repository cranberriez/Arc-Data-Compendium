import { formatName } from "@/data/items/itemUtils";
import { Item, GearStat } from "@/types";
import React from "react";
import {
	Shield,
	Swords,
	MoveHorizontal,
	Tally4,
	SquareAsterisk,
	Grid2x2,
	Weight,
	Backpack,
	ChartPie,
	Sword,
} from "lucide-react";

export const GearSection = ({ item }: { item: Item }) => {
	if (!item.gear) return null;
	const gearType = item.gear.category;
	const gearStats: GearStat | {} = item.gear.stats || {};

	const formatPercent = (value: number, reverse?: boolean) => {
		return `${reverse && value > 0 ? "-" : ""}${value * 100}%`;
	};

	const iconMap = {
		shieldCharge: Shield,
		damageMitigation: Swords,
		movePenalty: MoveHorizontal,
		segments: Tally4,
		minimumTier: SquareAsterisk,
		tier: SquareAsterisk,
		backpackSlots: Backpack,
		weightLimit: Weight,
		safePocketSize: Grid2x2,
		quickUseSlots: ChartPie,
		weaponSlots: Sword,
	};

	const baseAugment = {
		backpackSlots: 10,
		weightLimit: 45,
		safePocketSize: 3,
		quickUseSlots: 4,
		weaponSlots: 2,
		tier: 0,
	};

	const valueFormatting = (key: string, value: number | string) => {
		if (key === "damageMitigation" || key === "movePenalty") {
			return formatPercent(value as number, key === "movePenalty" ? true : false);
		} else if (key === "minimumTier") {
			switch (value) {
				case 0:
					return "None";
				case 1:
					return "Tier 1+";
				case 2:
					return "Tier 2+";
				case 3:
					return "Tier 3+";
			}
			return value.toString() + " ";
		} else if (key === "tier") {
			switch (value) {
				case 0:
					return "Light";
				case 1:
					return "Light";
				case 2:
					return "Light, Medium";
				case 3:
					return "Light, Medium, Heavy";
			}
			return value.toString() + " ";
		} else if (key === "weightLimit") {
			return `${value} kg`;
		} else {
			return value.toString();
		}
	};

	return (
		<div>
			<h3>Gear</h3>
			<div className="flex flex-col gap-2 py-2 px-4 bg-green-100 text-green-900 dark:text-green-100 dark:bg-green-900/10 rounded-md">
				{Object.entries(gearStats).map(([key, value], index) => {
					const icon = iconMap[key as keyof typeof iconMap] || null;

					return (
						<div
							key={index}
							className="grid gap-3 items-center grid-cols-[16px_1fr_2fr]"
						>
							<span className="flex items-center opacity-50">
								{icon
									? React.createElement(icon, {
											className: "inline-block",
											size: 16,
									  })
									: null}
							</span>
							<span className="font-normal">
								{key === "minimumTier"
									? "Required Augment"
									: key === "tier"
									? "Allowed Shield"
									: formatName(key)}
							</span>
							<span className="font-mono text-left">
								{valueFormatting(key, value as number)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
