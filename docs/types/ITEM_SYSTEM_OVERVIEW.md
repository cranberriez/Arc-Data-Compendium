# Item System Overview

## Core Concepts

1. **Base Item Structure**: All game entities inherit from a base item type with common properties
2. **Type-Specific Extensions**: Specialized interfaces extend the base item with type-specific properties
3. **Component-Based UI**: Reusable UI components that adapt based on item type
4. **Centralized State Management**: Context providers for managing item state and interactions

## Architecture

```
src/
  components/
    items/
      dialogs/          # Dialog components for item inspection
      displays/         # Reusable item display components
      types/            # Type-specific UI components
  data/
    items/          # Base item data and handlers
    types/
      base.ts       # Base item interfaces
      weapon.ts       # Weapon-specific types
      mod.ts          # Mod-specific types
      workbench.ts    # Workbench-specific types
      index.ts        # Re-exports all types
  contexts/
    ItemContext.tsx  # Existing item context
    GameContext.tsx   # Extended game context (future)
```

## Type System Hierarchy

1. **BaseItem**: Core properties all game objects share
2. **Item**: Union type of all possible item types
3. **Type-Specific Interfaces**: Extend BaseItem with type-specific properties

## Data Flow

1. Data is loaded into the appropriate context
2. Components receive items via props or context
3. Type guards determine which components to render
4. User interactions update the context

## State Management

- **Item State**: Current items, filters, and selection
- **UI State**: Dialog visibility, active tabs, etc.
- **Game State**: Player inventory, equipped items, etc.

## Performance Considerations

- Memoize expensive calculations
- Virtualize long lists
- Lazy load type-specific components
- Optimize re-renders with proper dependency arrays
