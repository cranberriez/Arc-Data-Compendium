// Stat max values for creating the horizontal bars representing the stat
export const STAT_MAX_VALUES: Record<string, number> = {
	damage: 200,
	fire_rate: 100,
	range: 150,
	stability: 100,
	agility: 100,
	stealth: 100,
};

// Shield Values for Selection
export type Shield_Data = Record<
	string,
	{ health: number; negationPercent: number; color: string }
>;

export const SHIELD_VALUES: Shield_Data = {
	none: { health: 0, negationPercent: 0, color: "bg-common" },
	light: { health: 50, negationPercent: 0.23, color: "bg-uncommon" },
	medium: { health: 80, negationPercent: 0.45, color: "bg-rare" },
	heavy: { health: 120, negationPercent: 0.65, color: "bg-epic" },
};

export const AMMO_TYPE_COLORS: Record<string, string> = {
	light: "bg-amber-200/25 text-amber-800 dark:text-amber-400",
	medium: "bg-blue-200/25 text-blue-800 dark:text-blue-400",
	heavy: "bg-rose-200/25 text-rose-800 dark:text-rose-400",
	shotgun: "bg-purple-200/25 text-purple-800 dark:text-purple-400",
	energy: "bg-green-200/25 text-green-800 dark:text-green-400",
};
