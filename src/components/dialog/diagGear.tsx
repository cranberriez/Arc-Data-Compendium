import { formatCamelName } from "@/data/items/itemUtils";
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
	User,
} from "lucide-react";

// Common utility functions and components
const formatPercent = (value: number, reverse?: boolean) => {
	return `${reverse && value > 0 ? "-" : ""}${value * 100}%`;
};

const StatRow = ({ keyName, value }: { keyName: string; value: number | string }) => {
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

	const icon = iconMap[keyName as keyof typeof iconMap];

	return (
		<div className="grid gap-3 items-center grid-cols-[16px_1fr_2fr]">
			<span className="flex items-center opacity-50">
				{icon &&
					React.createElement(icon, {
						className: "inline-block",
						size: 16,
					})}
			</span>
			<span className="font-normal">
				{keyName === "minimumTier"
					? "Required Augment"
					: keyName === "tier"
					? "Allowed Shield"
					: formatCamelName(keyName)}
			</span>
			<span className="font-mono text-left">{value}</span>
		</div>
	);
};

// Shield-specific component
export const ShieldSection = ({ stats }: { stats: GearStat }) => {
	const formatShieldValue = (key: string, value: number | string) => {
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
				default:
					return value.toString() + " ";
			}
		} else {
			return value.toString();
		}
	};

	return (
		<div className="flex flex-col gap-2 py-2 px-4 bg-green-100 text-green-900 dark:text-green-100 dark:bg-green-900/10 rounded-md">
			{Object.entries(stats).map(([key, value], index) => (
				<StatRow
					key={index}
					keyName={key}
					value={formatShieldValue(key, value as number)}
				/>
			))}
		</div>
	);
};

// Augment-specific component
export const AugmentSection = ({ stats }: { stats: GearStat }) => {
	const baseAugment = {
		backpackSlots: 10,
		weightLimit: 45,
		safePocketSize: 3,
		quickUseSlots: 4,
		weaponSlots: 2,
		tier: 0,
	};

	// Helper to format the comparison with base values
	const formatComparison = (key: string, value: number, baseValue: number) => {
		// Skip comparison for tier as it's a categorical value
		if (key === "tier") return "";

		const diff = value - baseValue;
		if (diff === 0) return ` (Base: ${baseValue})`;

		const isPositive = diff > 0;
		// For most stats, higher is better
		const isBetter = isPositive;

		const formattedDiff = key === "weightLimit" ? `${Math.abs(diff)} kg` : Math.abs(diff);
		const indicator = isBetter ? "↑" : "↓";
		const color = isBetter ? "text-green-600" : "text-red-600";

		return (
			<span>
				{` (Base: ${key === "weightLimit" ? `${baseValue} kg` : baseValue} `}
				<span className={color}>
					{indicator}
					{formattedDiff}
				</span>
				{`)`}
			</span>
		);
	};

	const formatAugmentValue = (key: string, value: number | string) => {
		if (key === "tier") {
			switch (value) {
				case 0:
					return "Light";
				case 1:
					return "Light";
				case 2:
					return "Light, Medium";
				case 3:
					return "Light, Medium, Heavy";
				default:
					return value.toString() + " ";
			}
		} else if (key === "weightLimit") {
			return `${value} kg`;
		} else {
			return value.toString();
		}
	};

	// Custom StatRow for Augments that includes comparison
	const AugmentStatRow = ({ keyName, value }: { keyName: string; value: number | string }) => {
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

		const icon = iconMap[keyName as keyof typeof iconMap];
		const baseValue = baseAugment[keyName as keyof typeof baseAugment];
		const formattedValue = formatAugmentValue(keyName, value);
		const comparison =
			baseValue !== undefined ? formatComparison(keyName, value as number, baseValue) : "";

		return (
			<div className="grid gap-3 items-center grid-cols-[16px_1fr_1fr_1fr]">
				<span className="flex items-center opacity-50">
					{icon &&
						React.createElement(icon, {
							className: "inline-block",
							size: 16,
						})}
				</span>
				<span className="font-normal">
					{keyName === "minimumTier"
						? "Required Augment"
						: keyName === "tier"
						? "Allowed Shields"
						: formatCamelName(keyName)}
				</span>
				<span className="font-mono text-left flex items-center">{formattedValue}</span>
				<span className="font-mono text-left flex items-center text-xs opacity-80">
					{comparison}
				</span>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2 py-2 px-4 bg-green-100 text-green-900 dark:text-green-100 dark:bg-green-900/10 rounded-md">
			{Object.entries(stats).map(([key, value], index) => (
				<AugmentStatRow
					key={index}
					keyName={key}
					value={value as number}
				/>
			))}
		</div>
	);
};

// Main component that routes to the appropriate section based on gear category
export const GearSection = ({ item }: { item: Item }) => {
	if (!item.gear) return null;
	const gearType = item.gear.category;
	const gearStats: GearStat | {} = item.gear.stats || {};

	// Early return if no stats
	if (!gearStats || Object.keys(gearStats).length === 0) return null;

	return (
		<div>
			<div className="font-mono font-light w-fit flex items-center gap-2 mb-2">
				<User
					className="inline-block"
					size={24}
				/>
				<p>
					<span className="inline-block text-lg">Gear Stats</span>
				</p>
			</div>
			{gearType === "shield" ? (
				<ShieldSection stats={gearStats as GearStat} />
			) : gearType === "augment" ? (
				<AugmentSection stats={gearStats as GearStat} />
			) : null}
		</div>
	);
};
