export interface TTKResult {
	bulletsToKill: number;
	timeToKillSeconds: number;
}

export function calculateTTK(
	baseDamage: number,
	fireRateRpm: number,
	targetHealth: number,
	shieldHealth: number,
	shieldNegationPercent: number, // e.g., 0.23 for 23%
	damageMultiplier: number = 1
): TTKResult {
	if (targetHealth <= 0) {
		return { bulletsToKill: 0, timeToKillSeconds: 0 };
	}

	if (fireRateRpm <= 0) {
		return { bulletsToKill: Infinity, timeToKillSeconds: Infinity };
	}

	const effectiveDamagePerShot = baseDamage * damageMultiplier;
	if (effectiveDamagePerShot <= 0) {
		return { bulletsToKill: Infinity, timeToKillSeconds: Infinity };
	}

	let bulletsFired = 0;
	let currentHealth = targetHealth;
	// let currentShieldHealth = shieldHealth; // Not strictly needed for this calculation path

	// Phase 1: Shield is active (if applicable)
	if (shieldHealth > 0 && shieldNegationPercent > 0) {
		const damageToShieldPoolPerShot = effectiveDamagePerShot * shieldNegationPercent;
		const damageToHealthPoolWhileShieldedPerShot =
			effectiveDamagePerShot * (1 - shieldNegationPercent);

		// If no damage is dealt to health while shield is up, and health is positive,
		// health will only be damaged after shield breaks (if it breaks).
		// If no damage is dealt to shield pool, it never breaks from its share.
		if (damageToShieldPoolPerShot <= 0 && damageToHealthPoolWhileShieldedPerShot <= 0) {
			return { bulletsToKill: Infinity, timeToKillSeconds: Infinity };
		}

		let bulletsForShieldDepletion = Infinity;
		if (damageToShieldPoolPerShot > 0) {
			bulletsForShieldDepletion = Math.ceil(shieldHealth / damageToShieldPoolPerShot);
		}

		let bulletsForHealthDepletionWhileShielded = Infinity;
		if (damageToHealthPoolWhileShieldedPerShot > 0) {
			bulletsForHealthDepletionWhileShielded = Math.ceil(
				currentHealth / damageToHealthPoolWhileShieldedPerShot
			);
		}
		// If damageToHealthPoolWhileShieldedPerShot is <= 0, health doesn't decrease in this phase,
		// so bulletsForHealthDepletionWhileShielded remains Infinity (correctly indicating shield must break first).

		if (bulletsForHealthDepletionWhileShielded <= bulletsForShieldDepletion) {
			// Target's health depletes before or at the same time shield's health pool would.
			bulletsFired = bulletsForHealthDepletionWhileShielded;
			// currentHealth is now effectively 0
		} else {
			// Shield's health pool depletes first.
			bulletsFired = bulletsForShieldDepletion;
			currentHealth -= bulletsFired * damageToHealthPoolWhileShieldedPerShot;
			// currentShieldHealth is now effectively 0

			if (currentHealth > 0) {
				// Phase 2: Shield is broken, direct damage to remaining health.
				// effectiveDamagePerShot is already confirmed > 0 from the top.
				const bulletsInPhase2 = Math.ceil(currentHealth / effectiveDamagePerShot);
				bulletsFired += bulletsInPhase2;
				// currentHealth is now effectively 0
			}
			// If currentHealth was <=0 after phase 1, bulletsFired is already correct.
		}
	} else {
		// No shield effect (either no shield health, or shieldNegationPercent is 0)
		// Damage goes directly to health.
		bulletsFired = Math.ceil(currentHealth / effectiveDamagePerShot);
		// currentHealth is now effectively 0
	}

	if (bulletsFired === Infinity) {
		return { bulletsToKill: Infinity, timeToKillSeconds: Infinity };
	}

	const fireRatePerSecond = fireRateRpm / 60;
	// TTK is 0 if 1 bullet kills. For N bullets, there are N-1 intervals.
	// If bulletsFired is 0 (target already dead), TTK is 0.
	const timeToKillSeconds = bulletsFired > 0 ? (bulletsFired - 1) / fireRatePerSecond : 0;

	return {
		bulletsToKill: bulletsFired,
		timeToKillSeconds: timeToKillSeconds,
	};
}
