import { BaseItem, ExtendedItem, InventoryItem, EquippableItem, ConsumableItem, Item } from './base';
import { ItemCategory, Rarity, ItemSource, Recipe } from './types';

/**
 * Type guard to check if an object is a valid BaseItem
 */
export function isBaseItem(item: unknown): item is BaseItem {
  if (typeof item !== 'object' || item === null) return false;
  
  const base = item as Partial<BaseItem>;
  
  return (
    typeof base.id === 'string' &&
    typeof base.name === 'string' &&
    typeof base.description === 'string' &&
    typeof base.rarity === 'string' &&
    Object.values<Rarity>({
      common: 'common',
      uncommon: 'uncommon',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary'
    } as const).includes(base.rarity as Rarity) &&
    typeof base.value === 'number' &&
    typeof base.weight === 'number' &&
    typeof base.maxStack === 'number' &&
    Array.isArray(base.categories) &&
    base.categories.every(cat => 
      ['recyclable', 'valuables', 'quick_use', 'ammunition', 'weapon', 'gear'].includes(cat)
    ) &&
    typeof base.icon === 'string' &&
    (base.flavorText === undefined || typeof base.flavorText === 'string') &&
    (base.sources === undefined || isItemSourceArray(base.sources)) &&
    (base.recipe === undefined || isRecipe(base.recipe)) &&
    typeof base.version === 'number'
  );
}

/**
 * Type guard to check if an object is a valid ExtendedItem
 */
export function isExtendedItem(item: unknown): item is ExtendedItem {
  if (!isBaseItem(item)) return false;
  
  const extended = item as Partial<ExtendedItem>;
  
  return (
    typeof extended.addedInVersion === 'string' &&
    typeof extended.lastUpdated === 'string' &&
    typeof extended.isBaseGame === 'boolean' &&
    typeof extended.isActive === 'boolean'
  );
}

/**
 * Type guard to check if an object is a valid InventoryItem
 */
export function isInventoryItem(item: unknown): item is InventoryItem {
  if (!isBaseItem(item)) return false;
  
  const invItem = item as Partial<InventoryItem>;
  
  return (
    typeof invItem.instanceId === 'string' &&
    typeof invItem.quantity === 'number' &&
    (invItem.durability === undefined || 
     (typeof invItem.durability === 'number' && invItem.durability >= 0 && invItem.durability <= 1)) &&
    invItem.acquiredAt instanceof Date &&
    (invItem.customName === undefined || typeof invItem.customName === 'string') &&
    (invItem.modifiers === undefined || (
      Array.isArray(invItem.modifiers) &&
      invItem.modifiers.every(isItemModifier)
    ))
  );
}

/**
 * Type guard to check if an object is a valid EquippableItem
 */
export function isEquippableItem(item: unknown): item is EquippableItem {
  if (!isBaseItem(item)) return false;
  
  const equipItem = item as Partial<EquippableItem>;
  
  return (
    typeof equipItem.slot === 'string' &&
    typeof equipItem.requiredLevel === 'number' &&
    (equipItem.requiredAttributes === undefined || (
      typeof equipItem.requiredAttributes === 'object' &&
      equipItem.requiredAttributes !== null &&
      Object.values(equipItem.requiredAttributes).every(val => typeof val === 'number')
    )) &&
    (equipItem.durability === undefined || (
      typeof equipItem.durability === 'object' &&
      equipItem.durability !== null &&
      typeof equipItem.durability.current === 'number' &&
      typeof equipItem.durability.max === 'number' &&
      (equipItem.durability.degradeRate === undefined || 
       typeof equipItem.durability.degradeRate === 'number')
    ))
  );
}

/**
 * Type guard to check if an object is a valid ConsumableItem
 */
export function isConsumableItem(item: unknown): item is ConsumableItem {
  if (!isBaseItem(item)) return false;
  
  const consumable = item as Partial<ConsumableItem>;
  
  return (
    Array.isArray(consumable.effects) &&
    consumable.effects.every(effect => 
      effect &&
      typeof effect === 'object' &&
      'type' in effect &&
      'value' in effect &&
      (effect.duration === undefined || typeof effect.duration === 'number')
    ) &&
    typeof consumable.cooldown === 'number' &&
    typeof consumable.consumeOnUse === 'boolean'
  );
}

/**
 * Type guard to check if an object is a valid ItemModifier
 */
export function isItemModifier(modifier: unknown): boolean {
  if (typeof modifier !== 'object' || modifier === null) return false;
  
  const mod = modifier as Record<string, unknown>;
  
  return (
    typeof mod.id === 'string' &&
    typeof mod.name === 'string' &&
    typeof mod.description === 'string' &&
    typeof mod.rarity === 'string' &&
    ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(mod.rarity) &&
    typeof mod.isPositive === 'boolean' &&
    mod.statModifiers !== undefined &&
    typeof mod.statModifiers === 'object' &&
    mod.statModifiers !== null
  );
}

/**
 * Type guard to check if an array contains valid ItemSources
 */
function isItemSourceArray(sources: unknown): sources is ItemSource[] {
  if (!Array.isArray(sources)) return false;
  
  return sources.every(source => {
    if (typeof source !== 'object' || source === null) return false;
    
    const src = source as Partial<ItemSource>;
    const validTypes: ItemSource['type'][] = ['drop', 'buy', 'quest', 'found', 'event', 'craft', 'enemy', 'crafting'];
    
    return (
      typeof src.type === 'string' &&
      validTypes.includes(src.type as any) &&
      typeof src.location === 'string' &&
      (src.level === undefined || typeof src.level === 'string') &&
      (src.chance === undefined || (typeof src.chance === 'number' && src.chance >= 0 && src.chance <= 1)) &&
      (src.questId === undefined || typeof src.questId === 'string') &&
      (src.enemyType === undefined || typeof src.enemyType === 'string') &&
      (src.value === undefined || typeof src.value === 'number') &&
      (src.trader === undefined || 
       ['Tian Wen', 'Lance', 'Apollo', 'Shani'].includes(src.trader as string))
    );
  });
}

/**
 * Type guard to check if an object is a valid Recipe
 */
function isRecipe(recipe: unknown): recipe is Recipe {
  if (typeof recipe !== 'object' || recipe === null) return false;
  
  const rec = recipe as Partial<Recipe>;
  const validWorkbenches = ['none', 'small', 'medium', 'large', 'weaponsmith', 'electronics', 'chemistry'];
  
  return (
    typeof rec.id === 'string' &&
    typeof rec.outputItemId === 'string' &&
    Array.isArray(rec.requirements) &&
    rec.requirements.every(req => 
      req &&
      typeof req === 'object' &&
      'itemId' in req &&
      'count' in req &&
      typeof req.itemId === 'string' &&
      typeof req.count === 'number'
    ) &&
    typeof rec.workbench === 'string' &&
    validWorkbenches.includes(rec.workbench) &&
    typeof rec.workbenchTier === 'number' &&
    rec.workbenchTier >= 1 &&
    rec.workbenchTier <= 5 &&
    typeof rec.craftTime === 'number' &&
    typeof rec.outputCount === 'number' &&
    typeof rec.unlockedByDefault === 'boolean'
  );
}

/**
 * Type guard to check if an object is a valid Item of any type
 */
export function isItem(item: unknown): item is Item {
  return (
    isBaseItem(item) ||
    isExtendedItem(item) ||
    isInventoryItem(item) ||
    isEquippableItem(item) ||
    isConsumableItem(item)
  );
}
