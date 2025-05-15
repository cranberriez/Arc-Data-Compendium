# Item System Documentation

## Overview

The item system is a core part of the Arc Data Compendium that manages in-game items, their properties, sources, and relationships. It provides utilities for filtering, sorting, and querying item data.

## Item Schema

### Core Types

#### `ItemType`

Defines the category of an item:

-   `quick_use`: Items that can be used immediately
-   `recyclable`: Items that can be broken down into materials
-   `crafting_material`: Base materials used for crafting
-   `valuable`: High-value items
-   `weapon`: Combat items
-   `gear`: Equipment items
-   `quest_item`: Items related to quests
-   `consumable`: Items that can be used/consumed

#### `Rarity`

Defines item rarity levels:

-   `common`
-   `uncommon`
-   `rare`
-   `epic`
-   `legendary`

#### `SourceType`

Defines how an item can be obtained:

-   `drop`: From enemies/containers
-   `buy`: From vendors
-   `quest`: Quest rewards
-   `found`: World spawns
-   `event`: Special events
-   `craft`: Crafting

### Core Interfaces

#### `Item`

Represents an in-game item:

```typescript
{
  id: string;                    // Unique identifier
  display_name: string;          // Human-readable name
  icon: LucideIcon | null;       // Visual representation
  type: ItemType;                // Item category
  rarity: Rarity;                // Rarity level
  craftable: boolean;            // If the item can be crafted
  recipe: string | null;         // Recipe ID if craftable
  sources: ItemSource[];         // How to obtain the item
  value: number;                 // In-game currency value
  recycling?: Recycling[];       // What this can be recycled into
}
```

#### `ItemSource`

Defines where/how to obtain an item:

```typescript
{
  type: SourceType;             // Source category
  location: string;              // Where to find/buy
  count?: number;                // Stack size (for buy/recycle)
  value?: number;               // Cost (for buy)
  itemId?: string;              // Source item ID (for recycling)
}
```

#### `Recycling`

Defines what an item breaks down into:

```typescript
{
	id: string; // Resulting item ID
	count: number; // Quantity obtained
}
```

## Utilities

### Item Dialog Context (`ItemDialogProvider`)

A React context that provides a global dialog for displaying detailed item information.

**Features:**

-   Global access to item details from anywhere in the app
-   Consistent dialog behavior and styling
-   Automatic state management for open/close
-   Clean integration with the existing item system

**Usage:**

1. **Setup**: Wrap your app with `ItemDialogProvider` (already done in `AppProviders`)

    ```tsx
    <ItemDialogProvider>{/* Your app content */}</ItemDialogProvider>
    ```

2. **Opening the Dialog**: Use the `useItemDialog` hook in any component

    ```tsx
    const { openDialog } = useItemDialog();

    // Later in your component:
    <button onClick={() => openDialog(item)}>View Item Details</button>;
    ```

**API:**

```typescript
interface ItemDialogContextType {
	isOpen: boolean; // Current dialog visibility state
	item: Item | null; // Currently displayed item
	openDialog: (item: Item) => void; // Function to open dialog with an item
	closeDialog: () => void; // Function to close the dialog
}

// Hook to access the dialog context
function useItemDialog(): ItemDialogContextType;
```

### Item Provider (`ItemProvider`)

A React context provider that manages item state, filtering, and sorting.

**Features:**

-   Maintains a filtered list of items based on search/filters
-   Handles sorting by various fields
-   Manages filter state (search, rarities, types)
-   Provides methods to update filters and sorting

**Key Methods:**

-   `setSearchQuery(query: string)`: Filters items by name/ID
-   `toggleRarity(rarity: string)`: Toggles a rarity filter
-   `toggleType(type: string)`: Toggles an item type filter
-   `setSort(field: SortField, order: SortOrder)`: Sets sort field and order
-   `resetFilters()`: Resets all filters to defaults

### Item Handler (`itemHandler.ts`)

Manages the core item data and provides access to items.

**Exports:**

-   `items`: Readonly array of all game items
-   `itemsData`: Raw items data (mutable)
-   Utility functions from `itemUtils`

### Item Utilities (`itemUtils.ts`)

Provides helper functions for item operations.

#### Core Functions

**`getItemSources(itemId, items)`**

-   Gets all sources for an item, including recycling sources
-   Returns: Array of `ItemSource`

**`getRecycleSources(itemId, items)`**

-   Finds all items that can be recycled into the specified item
-   Uses caching for performance
-   Returns: Array of `ItemSource`

**`buildRecycleSourceMap(items)`**

-   Internal function that builds a reverse lookup map for recycling
-   Used by other utility functions

**`invalidateRecycleCache()`**

-   Clears the recycling source cache
-   Call after modifying items that affect recycling

### Helper Functions (from `types.tsx`)

**`getRarityColor(rarity: string)`**

-   Returns Tailwind CSS class for the rarity color

**`getRarityBorder(rarity: string)`**

-   Returns Tailwind CSS border class for the rarity

**`getTypeIcon(type: string, props?)`**

-   Returns an icon component for the given item type
-   Props can customize the icon's appearance

**`getSourceIcon(type: SourceType)`**

-   Returns an icon component for the given source type

**`formatName(type: string)`**

-   Converts snake_case to Title Case

## Usage Examples

### Getting an Item's Sources

```typescript
const sources = getItemSources("healing_stim", items);
```

### Finding What Recycles into an Item

```typescript
const sources = getRecycleSources("arc_alloys", items);
```

### Using the Item Provider

```jsx
function ItemList() {
	const { filteredItems } = useItems();

	return (
		<div>
			{filteredItems.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}
		</div>
	);
}
```

## Best Practices

1. Use the `ItemProvider` for UI components to get filtered/sorted items
2. Access the raw `items` array only when necessary
3. Invalidate the recycle cache after modifying items that affect recycling
4. Use the provided helper functions for consistent styling and formatting
5. Keep item IDs in kebab-case for consistency

## Data Flow

1. Items are defined in `itemHandler.ts`
2. The `ItemProvider` processes and makes them available via context
3. Components consume items through the `useItems()` hook
4. Utilities provide additional querying and formatting capabilities
