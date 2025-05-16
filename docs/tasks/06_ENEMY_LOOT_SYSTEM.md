# Enemy and Loot System Implementation

## Overview
Implement enemies and their associated loot tables.

## Prerequisites
- [ ] Complete tasks in `00_ITEM_SYSTEM_MIGRATION.md`
- [ ] Complete item system implementation

## Implementation Tasks

### 1. Type Definitions
- [ ] Create `src/types/actors/enemy.ts` with:
  - `EnemyStats` interface
  - `LootTableEntry` interface
  - `Enemy` interface

### 2. Enemy Data
- [ ] Create enemy definitions in `src/data/actors/enemies.ts`
- [ ] Implement loot table generation
- [ ] Add enemy spawn logic

### 3. Loot System
- [ ] Implement `LootSystem` in `src/systems/LootSystem.ts`
- [ ] Add methods for:
  - Rolling loot drops
  - Generating loot containers
  - Distributing loot

### 4. UI Components
- [ ] Create `EnemyDisplay` component
- [ ] Implement loot container UI
- [ ] Add loot preview

## Testing
- [ ] Test loot drop rates
- [ ] Verify enemy stats
- [ ] Test loot container interactions

## Related Components
- `src/components/actors/EnemyDisplay.tsx`
- `src/components/loot/LootContainer.tsx`
- `src/components/loot/LootPreview.tsx`
