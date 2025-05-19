// Re-export all item-related types and utilities

// Base types and interfaces
export * from './items/types';
export * from './items/base';

// Type guards
export * from './items/guards';

// Re-export commonly used types for convenience
export type {
  Item,
  BaseItem,
  ExtendedItem,
  InventoryItem,
  EquippableItem,
  ConsumableItem,
  ItemModifier
} from './items/base';

export type {
  Rarity,
  ItemSource,
  ItemCategory,
  Recipe,
  RecipeRequirement,
  ItemSourceType,
  QuickUseCategory,
  ShieldType,
  AmmoType,
  ModSlotType,
  WeaponType,
  TraderName
} from './items/types';

// Re-export type guards
export {
  isItem,
  isBaseItem,
  isExtendedItem,
  isInventoryItem,
  isEquippableItem,
  isConsumableItem,
  isItemModifier
} from './items/guards';

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = { [K in keyof T]-?: NonNullable<T[K]> };
