# Weapon System Implementation

## Overview
Implement the comprehensive weapon system including base weapons, mods, and weapon stats.

## Prerequisites
- [ ] Complete tasks in `00_ITEM_SYSTEM_MIGRATION.md`

## Implementation Tasks

### 1. Type Definitions
- [ ] Create `src/types/items/weapon.ts` with:
  - `WeaponType` and `AmmoType` enums
  - `WeaponStats` and `WeaponTier` interfaces
  - `WeaponModSlot` and `Weapon` interfaces

### 2. Mod System
- [ ] Create `src/types/items/weaponMod.ts` with:
  - `ModSlotType` enum
  - `ModEffect` and `WeaponMod` interfaces
  - Mod compatibility types

### 3. Sample Data
- [ ] Create weapon data in `src/data/items/weaponItems.ts`
  - Multiple weapons of each type
  - Different tiers and variants
- [ ] Create mod data in `src/data/items/weaponMods.ts`
  - Sights, grips, magazines, etc.
  - Compatibility definitions

### 4. UI Components
- [ ] Create `WeaponDisplay` component
- [ ] Implement `WeaponStatsDisplay` with visual bars
- [ ] Create `ModSlot` component for weapon mods
- [ ] Implement mod installation/removal UI
- [ ] Add weapon comparison view

### 5. Integration
- [ ] Update item handler for weapons and mods
- [ ] Add weapon and mod filters to ItemContext
- [ ] Implement stat calculation system
- [ ] Add mod installation/removal logic

## Advanced Features
- [ ] Implement weapon tier upgrades
- [ ] Add weapon recoil pattern visualization
- [ ] Create weapon attachment preview
- [ ] Implement mod compatibility checking

## Testing
- [ ] Verify all weapon stats calculate correctly
- [ ] Test mod installation/removal
- [ ] Verify stat modifications from mods
- [ ] Test weapon comparison functionality

## Related Components
- `src/components/items/types/WeaponDisplay.tsx`
- `src/components/items/weapon/WeaponStats.tsx`
- `src/components/items/weapon/ModSlot.tsx`
- `src/components/items/weapon/WeaponComparison.tsx`
- `src/components/items/weapon/RecoilPattern.tsx`
