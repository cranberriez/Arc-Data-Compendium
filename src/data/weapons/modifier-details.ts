interface ModifierDetails {
	description: string;
	inverted: boolean; // TRUE represents if NEGATIVE values are GOOD
}

export const modifierDetails = {
	mods: {
		ads_speed: {
			description: "The time it takes to aim down sights.",
			inverted: false,
		},
		base_dispersion: {
			description: "The spread of the shotgun pellets.",
			inverted: true,
		},
		dispersion_recovery_time: {
			description: "The time it takes to regain accuracy between shots (crosshair spread).",
			inverted: false,
		},
		bullet_velocity: {
			description: "The speed of the bullet.",
			inverted: false,
		},
		durability_burn_rate: {
			description: "The durability reduction when firing.",
			inverted: true,
		},
		equip_time: {
			description: "The time it takes to unholster or switch to the weapon.",
			inverted: true,
		},
		unequip_time: {
			description: "The time it takes to holster or switch away from the weapon.",
			inverted: true,
		},
		fire_rate: {
			description: "The time between each shot.",
			inverted: false,
		},
		horizontal_recoil: {
			description: "The horizontal recoil of the weapon.",
			inverted: true,
		},
		vertical_recoil: {
			description: "The vertical recoil of the weapon.",
			inverted: true,
		},
		max_shot_dispersion: {
			description: "The amount of inaccuracy (crosshair spread) after multiple shots.",
			inverted: true,
		},
		per_shot_dispersion: {
			description: "The amount of inaccuracy (crosshair spread) after a single shot.",
			inverted: true,
		},
		noise: {
			description: "The audible noise level of the weapon.",
			inverted: false,
		},
		projectile_damage: {
			description: "The damage dealt by the projectile.",
			inverted: true, // this is a special case, anything less than 100% is BAD
		},
		recoil_recovery_duration: {
			description:
				"The time it takes for the crosshair to return to its original position after recoil.",
			inverted: true, // positive is bad
		},
		magazine_size: {
			description: "The number of bullets the magazine can hold.",
			inverted: false,
		},
		projectile_per_shot: {
			description: "The number of projectiles fired per shot.",
			inverted: false,
		},
	},
	upgrades: {
		bullet_velocity: {
			description: "The speed of the bullet.",
			inverted: false,
		},
		reload_time: {
			description: "The time it takes to reload the weapon.",
			inverted: false,
		},
		durability: {
			description: "The durability of the weapon.",
			inverted: false,
		},
		magazine_size: {
			description: "The number of bullets the magazine can hold.",
			inverted: false,
		},
		fire_rate: {
			description: "The time between each shot.",
			inverted: false,
		},
		horizontal_recoil: {
			description: "The horizontal recoil of the weapon.",
			inverted: true,
		},
		vertical_recoil: {
			description: "The vertical recoil of the weapon.",
			inverted: true,
		},
		max_shot_dispersion: {
			description: "The amount of inaccuracy (crosshair spread) after multiple shots.",
			inverted: true,
		},
		dispersion_recovery_time: {
			description: "The time it takes to regain accuracy between shots (crosshair spread).",
			inverted: false,
		},
		bolt_action_time: {
			description:
				"The time it takes to load another round after firing (fire rate for bolt actions).",
			inverted: false,
		},
	},
};
