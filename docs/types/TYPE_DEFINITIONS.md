# Type Definitions

## Base Types

### Common Enums

```typescript
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemSourceType = "drop" | "buy" | "quest" | "found" | "event" | "craft";

export type ItemCategory =
	| "recyclable"
	| "valuables"
	| "quick_use"
	| "ammunition"
	| "weapon"
	| "gear";

export type QuickUseCategory = "healing" | "throwable" | "utility";

export type ShieldType = "light" | "medium" | "heavy";

export type AmmoType = "light" | "medium" | "heavy" | "shotgun" | "energy";

export type ModSlotType = "muzzle" | "grip" | "magazine" | "stock" | "tech" | "sight";

export type WeaponType =
	| "shotgun"
	| "assault_rifle"
	| "pistol"
	| "submachine_gun"
	| "sniper_rifle"
	| "rifle"
	| "machine_gun";

export type TraderName = "Tian Wen" | "Lance" | "Apollo" | "Shani";

export type ItemSource =
	| {
			type: "found" | "quest" | "enemy" | "crafting";
			location: string;
			level?: string;
			chance?: number;
			questId?: string;
			enemyType?: string;
	  }
	| {
			type: "buy";
			location: string;
			value: number; // Price in currency
			trader: TraderName;
	  };

export interface RecipeRequirement {
	itemId: string; // ID of the required item
	count: number; // How many of this item are needed
}

export interface Recipe {
	id: string; // Unique identifier for the recipe (e.g., 'craft_bandage')
	outputItemId: string; // ID of the item this recipe produces
	requirements: RecipeRequirement[]; // Items needed to craft
	workbench: "none" | "small" | "medium" | "large" | "weaponsmith" | "electronics" | "chemistry";
	workbenchTier: number; // 1-5, where 1 is basic and 5 is advanced
	craftTime: number; // Time to craft in seconds
	outputCount: number; // How many items are produced (default: 1)
	unlockedByDefault: boolean;
	// If not unlocked by default, player needs to find the recipe item first
	// The recipe item ID would be the same as the recipe ID with '_blueprint' suffix
	// e.g., recipe ID 'craft_bandage' would have a blueprint item ID 'craft_bandage_blueprint'
}

/**
 * Recipe Registry
 * A centralized registry to manage all game recipes
 */
export class RecipeRegistry {
	private static instance: RecipeRegistry;
	private recipes: Map<string, Recipe> = new Map();
	private recipesByOutput: Map<string, Recipe[]> = new Map();

	private constructor() {}

	static getInstance(): RecipeRegistry {
		if (!RecipeRegistry.instance) {
			RecipeRegistry.instance = new RecipeRegistry();
		}
		return RecipeRegistry.instance;
	}

	/**
	 * Register a new recipe
	 */
	register(recipe: Recipe): void {
		this.recipes.set(recipe.id, recipe);

		// Add to output index
		if (!this.recipesByOutput.has(recipe.outputItemId)) {
			this.recipesByOutput.set(recipe.outputItemId, []);
		}
		this.recipesByOutput.get(recipe.outputItemId)?.push(recipe);
	}

	/**
	 * Get a recipe by its ID
	 */
	getRecipe(recipeId: string): Recipe | undefined {
		return this.recipes.get(recipeId);
	}

	/**
	 * Get all recipes that produce a specific item
	 */
	getRecipesForItem(itemId: string): Recipe[] {
		return this.recipesByOutput.get(itemId) || [];
	}

	/**
	 * Get all recipes that use a specific item as an ingredient
	 */
	getRecipesUsingItem(itemId: string): Recipe[] {
		const result: Recipe[] = [];
		for (const recipe of this.recipes.values()) {
			if (recipe.requirements.some((req) => req.itemId === itemId)) {
				result.push(recipe);
			}
		}
		return result;
	}

	/**
	 * Get all recipes that can be crafted at a specific workbench
	 */
	getRecipesForWorkbench(
		workbench: string,
		tier: number = 1,
		includeLowerTiers: boolean = true
	): Recipe[] {
		return Array.from(this.recipes.values()).filter((recipe) => {
			if (recipe.workbench !== workbench) return false;
			return includeLowerTiers ? recipe.workbenchTier <= tier : recipe.workbenchTier === tier;
		});
	}
}

/**
 * Helper Functions for Recipe System
 */

export function getBlueprintItemId(recipeId: string): string {
	return `${recipeId}_blueprint`;
}

export function getRecipeIdFromBlueprint(blueprintId: string): string | null {
	if (!blueprintId.endsWith("_blueprint")) return null;
	return blueprintId.replace(/_blueprint$/, "");
}

export function isRecipeUnlocked(
	recipeId: string,
	unlockedRecipes: Set<string>,
	defaultUnlocked: boolean = false
): boolean {
	const recipe = RecipeRegistry.getInstance().getRecipe(recipeId);
	if (!recipe) return false;

	return recipe.unlockedByDefault ? true : unlockedRecipes.has(recipeId);
}

export function getCraftableItems(
	availableItems: Map<string, number>,
	unlockedRecipes: Set<string>
): Array<{
	recipe: Recipe;
	canCraft: boolean;
	missingItems: Array<{ itemId: string; needed: number; have: number }>;
}> {
	const result: Array<{
		recipe: Recipe;
		canCraft: boolean;
		missingItems: Array<{ itemId: string; needed: number; have: number }>;
	}> = [];

	for (const recipe of RecipeRegistry.getInstance()["recipes"].values()) {
		if (!isRecipeUnlocked(recipe.id, unlockedRecipes)) continue;

		let canCraft = true;
		const missingItems: Array<{ itemId: string; needed: number; have: number }> = [];

		for (const req of recipe.requirements) {
			const have = availableItems.get(req.itemId) || 0;
			if (have < req.count) {
				canCraft = false;
				missingItems.push({
					itemId: req.itemId,
					needed: req.count,
					have,
				});
			}
		}

		result.push({
			recipe,
			canCraft,
			missingItems,
		});
	}

	return result;
}

export interface Recycling {
	id: string;
	count: number;
}

export interface StatModifier {
	stat: string;
	value: number;
	isPercentage: boolean;
}
```

### BaseItem

```typescript
export interface BaseItem {
	// Core Identification
	id: string;
	display_name: string;
	description: string;
	icon: LucideIcon | null;
	weight: number; // in kilograms (KG)

	// Classification
	itemType: ItemCategory;
	subType?: string; // For sub-categories like quick-use types
	materialClass?: "topside" | "scrap" | "organic" | "synthetic"; // Material classification
	rarity: Rarity;

	// Game Economy
	value: number;
	sources: ItemSource[];

	// Crafting & Recycling
	craftable: boolean;
	craftInRaid?: boolean; // If true, can be crafted in raid (default: false if not present)
	recipeId?: string; // ID of the recipe used to craft this item
	isRecyclable: boolean;
	recyclingOutput?: {
		id: string; // Item ID to produce
		min: number; // Minimum quantity
		max: number; // Maximum quantity
		chance?: number; // 0-1 chance to get each item (default: 1.0 if not specified)
	}[];

	// Throwable Properties
	throwable?: {
		damage: number; // Base damage on impact
		radius: number; // Effect radius in meters
		effect?: string; // Optional effect (e.g., 'explosive', 'stun', 'smoke')
	};
}
```

## Extended Types

### Weapon

```typescript
export interface WeaponStats {
	damage: number;
	fireRate: number; // Rounds per minute
	range: number; // Effective range in meters
	stability: number; // Recoil control (0-100)
	agility: number; // Handling and aim-down-sights speed (0-100)
	stealth: number; // Noise level and detection chance (0-100)
	magazineSize: number; // Rounds per magazine
	reloadTime: number; // Seconds to reload
}

export interface WeaponTier {
	tier: number;
	statModifiers: StatModifier[];
	canBeDowngraded: boolean;
}

export interface WeaponModSlot {
	type: ModSlotType;
	occupied: boolean;
	modId?: string; // ID of the equipped mod, if any
}

export interface Weapon extends BaseItem {
	itemType: "weapon";
	weaponType: WeaponType;
	ammoType: AmmoType;
	baseTier: number; // Minimum tier (0-5)
	currentTier: number;
	stats: WeaponStats;
	modSlots: WeaponModSlot[];
	tiers: WeaponTier[];
	upgradeVariants: string[]; // IDs of variant weapons
}
```

### Quick Use Item

```typescript
export interface HealingStats {
	amount: number; // Flat healing amount
	isOverTime: boolean; // If true, amount is per second
	duration: number; // Duration in seconds (0 for instant)
	useTime: number; // Time to use in seconds
}

export interface ThrowableStats {
	damage: number; // Flat damage amount
	isOverTime: boolean; // If true, damage is per second
	radius: number; // Effect radius in meters
	armTime: number; // Time to arm in seconds
}

export interface UtilityStats {
	// Generic stats that can be used for various utility items
	[key: string]: number | boolean | string;
}

export interface QuickUseItem extends BaseItem {
	itemType: "quick_use";
	quickUseType: QuickUseCategory;

	// Only one of these will be present based on quickUseType
	healingStats?: HealingStats;
	throwableStats?: ThrowableStats;
	utilityStats?: UtilityStats;
}
```

### Gear

```typescript
export interface ShieldStats {
	maxShield: number; // Maximum shield capacity
	rechargeRate: number; // Shield recharge per second
	rechargeDelay: number; // Delay before recharge starts (seconds)
	damageMitigation: number; // Percentage of damage absorbed (0-1)
}

export interface Shield extends BaseItem {
	itemType: "gear";
	subType: "shield";
	shieldType: ShieldType;
	stats: ShieldStats;
	compatibleAugmentId?: string; // ID of compatible augment, if any
}

export interface AugmentStats {
	backpackSlots?: number; // Additional inventory slots
	quickUseSlots?: number; // Additional quick-use slots
	safePocketSize?: number; // Number of protected slots
	weaponSlots?: number; // Additional weapon slots
	weightLimit?: number; // Additional weight capacity
}

export interface Augment extends BaseItem {
	itemType: "gear";
	subType: "augment";
	stats: AugmentStats;
	compatibleShieldTypes: ShieldType[]; // Which shield types this augment works with
}
```

### Mod

```typescript
export interface ModEffect {
	targetStat: string; // Which stat to modify (e.g., 'damage', 'fireRate')
	value: number; // The amount to modify by
	isPercentage: boolean; // Whether the value is a percentage (true) or flat (false)
	description: string; // Human-readable description of the effect
	conditional?: {
		stat: string; // Stat that must meet condition
		operator: ">" | "<" | ">=" | "<=" | "===" | "!==";
		value: number; // Value to compare against
	};
}

export interface Mod extends BaseItem {
	itemType: "mod";
	slotType: ModSlotType; // What type of slot this mod fits in
	compatibleWeaponTypes: WeaponType[]; // Which weapon types this mod works with
	effects: ModEffect[];
	requiredLevel: number;
	incompatibleMods?: string[]; // IDs of mods that can't be equipped with this one
	installationTime?: number; // Time to install in seconds
}
```

## Union Types

```typescript
// Base union type for all game items
export type GameItem = BaseItem | Weapon | QuickUseItem | Shield | Augment | Mod;

// Specific item type unions
export type GearItem = Shield | Augment;
export type QuickUseItemType = QuickUseItem;

// Type guard functions
export function isWeapon(item: GameItem): item is Weapon {
	return item.itemType === "weapon";
}

export function isShield(item: GameItem): item is Shield {
	return item.itemType === "gear" && "subType" in item && item.subType === "shield";
}

export function isAugment(item: GameItem): item is Augment {
	return item.itemType === "gear" && "subType" in item && item.subType === "augment";
}

export function isQuickUseItem(item: GameItem): item is QuickUseItem {
	return item.itemType === "quick_use";
}

export function isMod(item: GameItem): item is Mod {
	return item.itemType === "mod";
}
```

## Helper Functions

```typescript
// Calculate total weight of an item including mods
export function calculateTotalWeight(
	item: GameItem,
	getItemById: (id: string) => GameItem | undefined
): number {
	let totalWeight = item.weight;

	if (isWeapon(item)) {
		// Add weight of installed mods
		for (const slot of item.modSlots) {
			if (slot.modId) {
				const mod = getItemById(slot.modId);
				if (mod) {
					totalWeight += mod.weight;
				}
			}
		}
	}

	return totalWeight;
}

// Get all stats for a weapon including mod effects
export function getWeaponStats(
	weapon: Weapon,
	getItemById: (id: string) => GameItem | undefined
): WeaponStats {
	// Start with base stats
	const stats = { ...weapon.stats };

	// Apply tier modifiers
	const currentTier = weapon.tiers.find((t) => t.tier === weapon.currentTier);
	if (currentTier) {
		applyStatModifiers(stats, currentTier.statModifiers);
	}

	// Apply mod effects
	for (const slot of weapon.modSlots) {
		if (slot.modId) {
			const mod = getItemById(slot.modId);
			if (mod && isMod(mod)) {
				applyStatModifiers(stats, mod.effects);
			}
		}
	}

	return stats;
}

function applyStatModifiers(stats: Record<string, number>, modifiers: StatModifier[]): void {
	for (const mod of modifiers) {
		if (mod.stat in stats) {
			if (mod.isPercentage) {
				stats[mod.stat] *= 1 + mod.value / 100;
			} else {
				stats[mod.stat] += mod.value;
			}
		}
	}
}
```

### Workbench

```typescript
export interface WorkbenchTier {
	tier: number;
	displayName: string;
	description: string;
	requiredItems: Array<{ itemId: string; count: number }>;
	unlockCost: number;
	craftingSpeedMultiplier: number;
	unlockedRecipes: string[];
}

export interface Workbench extends BaseItem {
	type: "workbench";
	maxTier: number;
	currentTier: number;
	tiers: WorkbenchTier[];
	upgradeInProgress?: {
		targetTier: number;
		completionTime: Date;
	};
}
```

### Enemy

```typescript
export interface EnemyStats {
	health: number;
	damage: number;
	attackSpeed: number;
	moveSpeed: number;
	armor: number;
	resistance: number;
}

export interface LootTableEntry {
	itemId: string;
	chance: number;
	minCount: number;
	maxCount: number;
	requiredLevel?: number;
}

export interface Enemy extends BaseItem {
	type: "enemy";
	level: number;
	stats: EnemyStats;
	lootTable: LootTableEntry[];
	experience: number;
	spawnLocations: string[];
	behavior?: string;
	weaknesses?: string[];
	resistances?: string[];
}
```

## Union Types

```typescript
export type Item = BaseItem | Weapon | Mod | Workbench | Enemy;

export type ItemType = Item["type"];
```

## Type Guards

```typescript
export function isWeapon(item: Item): item is Weapon {
	return item.type === "weapon";
}

export function isMod(item: Item): item is Mod {
	return item.type === "mod";
}

export function isWorkbench(item: Item): item is Workbench {
	return item.type === "workbench";
}

export function isEnemy(item: Item): item is Enemy {
	return item.type === "enemy";
}
```
