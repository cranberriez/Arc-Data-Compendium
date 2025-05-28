import { Item, QuickUseCharge, QuickUseStat } from "@/types";
import {
	ChartNoAxesColumn,
	Dumbbell,
	Gauge,
	HeartPulseIcon,
	Hourglass,
	InfoIcon,
	MoveHorizontal,
	Shield,
	ShieldPlus,
	Swords,
	Timer,
	Zap,
} from "lucide-react";
import React from "react";

const formatName = (str: string) => str.charAt(0).toUpperCase() + str.replace("_", " ").slice(1);

export const QuickUseSection = ({ item }: { item: Item }) => {
	if (!item.quickUse) return null;

	return (
		<div>
			<div className="font-mono font-light w-fit flex items-center gap-2 mb-2">
				<ChartNoAxesColumn
					className="inline-block"
					size={24}
				/>
				<p>
					<span className="inline-block text-lg">Quick Use Stats</span>
				</p>
			</div>

			{item.flavorText && (
				<p className="text-sm opacity-75 mb-2 max-w-lg break-words">{item.flavorText}</p>
			)}

			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2 py-2 px-4 bg-amber-100 text-amber-900 dark:text-amber-100 dark:bg-amber-900/10 rounded-md">
					{item.quickUse?.stats?.map((stat, index) => (
						<StatItem
							key={index}
							stat={stat}
						/>
					))}
				</div>

				{item.quickUse.charge && <Charge charge={item.quickUse.charge} />}
			</div>
		</div>
	);
};

const StatItem = ({ stat }: { stat: QuickUseStat }) => {
	const iconMap = {
		healing: HeartPulseIcon,
		damage: Swords,
		use_time: Timer,
		delay: Timer,
		duration: Hourglass,
		stamina: Dumbbell,
		range: MoveHorizontal,
		stun: Zap,
		repair: ShieldPlus,
	};

	const icon = iconMap[stat.name as keyof typeof iconMap] || InfoIcon;

	let statValue = "";
	if (stat.value) {
		statValue = stat.value.toString();
	} else if (stat.duration) {
		statValue = stat.duration.toString() + "s";
	} else if (stat.range) {
		statValue = stat.range.toString() + "m";
	}

	return (
		<div
			key={stat.name}
			className="grid gap-3 items-center grid-cols-[16px_1fr_3fr]"
		>
			<span className="flex items-center opacity-50">
				{React.createElement(icon, { className: "inline-block", size: 16 })}
			</span>
			<span className="font-normal">{formatName(stat.name)}</span>
			<span className="font-mono text-left">
				{statValue}
				{stat.perSecond ? "/s" : ""}
				{stat.duration && stat.perSecond ? ` for ${stat.duration}s` : ""}
				{stat.effect ? ` (${stat.effect})` : ""}
			</span>
		</div>
	);
};

const Charge = ({ charge }: { charge: QuickUseCharge }) => {
	return (
		<div className="flex flex-col gap-2 py-2 px-4 bg-blue-100 text-blue-900 dark:text-blue-100 dark:bg-blue-900/10 rounded-md">
			{Object.entries(charge).map(([key, value]) => {
				let displayValue = "";
				let name = "";

				if (key === "type") {
					displayValue = formatName(value.toString());
					name = "Usage Type";
				} else if (key === "rechargeRate" && typeof value === "number") {
					displayValue = `${value * 100}% /s`;
				} else if (key === "drainRate" && typeof value === "number") {
					displayValue = `${value * 100}% /s`;
				} else {
					displayValue = value.toString();
				}

				name = key.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());

				return (
					<ChargeItem
						key={key}
						name={name}
						value={displayValue}
					/>
				);
			})}
		</div>
	);
};

interface ChargeItemProps {
	name: string;
	value: string | number;
}

const ChargeItem = ({ name, value }: ChargeItemProps) => {
	return (
		<div className="grid gap-3 items-center grid-cols-[16px_1fr_3fr]">
			<span className="flex items-center opacity-50">
				{name === "Usage Type" ? (
					<Gauge
						className="inline-block"
						size={16}
					/>
				) : (
					<></>
				)}
			</span>
			<span className="font-normal">{name}</span>
			<span className="font-mono text-left">{value}</span>
		</div>
	);
};
