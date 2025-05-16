# Quick Use Items Implementation

## Overview
Implement support for Quick Use items (healing, throwables, utilities) in the item system.

## Prerequisites
- [ ] Complete tasks in `00_ITEM_SYSTEM_MIGRATION.md`

## Implementation Tasks

### 1. Type Definitions
- [ ] Create `src/types/items/quick-use.ts` with:
  - `QuickUseCategory` type
  - `HealingStats` interface
  - `ThrowableStats` interface
  - `UtilityStats` interface
  - `QuickUseItem` interface extending BaseItem

### 2. Sample Data
- [ ] Create sample quick use items in `src/data/items/quickUseItems.ts`
  - Bandages (healing)
  - Medkits (healing)
  - Grenades (throwable)
  - Smoke Bombs (throwable)
  - Flashbangs (utility)

### 3. UI Components
- [ ] Create `QuickUseDisplay` component
- [ ] Implement healing item display with progress bars
- [ ] Add throwable item stats display
- [ ] Create utility item action buttons

### 4. Integration
- [ ] Update item handler to process quick use items
- [ ] Add quick use item filters to ItemContext
- [ ] Register quick use item components in dialog system

## Testing
- [ ] Verify all quick use items display correctly
- [ ] Test healing item interactions
- [ ] Verify throwable item stats
- [ ] Test utility item actions

## Related Components
- `src/components/items/types/QuickUseDisplay.tsx`
- `src/components/items/actions/UseItemButton.tsx`
- `src/components/items/stats/HealingStats.tsx`
- `src/components/items/stats/ThrowableStats.tsx`
