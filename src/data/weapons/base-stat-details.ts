interface BaseStatDetails {
	description: string;
}

export const baseStatDetails: Record<string, BaseStatDetails> = {
	damage: {
		description: "The damage dealt by the weapon.",
	},
	fire_rate: {
		description: "The time between each shot.",
	},
	range: {
		description: "The effective range of the weapon before it experiences damage falloff.",
	},
	stability: {
		description: "The recoil control and reduction of shot dispersion of the weapon.",
	},
	agility: {
		description: "The equip speed and aim down sights speed of the weapon.",
	},
	stealth: {
		description: "The noise level of the weapon.",
	},
	arc_armor_penetration: {
		description:
			"The ability for the weapon to damage arc armor, does not translate to damage dealt to weakpoints.",
	},
	firing_mode: {
		description: "The way the weapon fires and the action required between each shot.",
	},
};
