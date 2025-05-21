# Recipe System Integration

## 1. Schema Design Best Practices

### a. Recipe Schema Structure
- **Keep recipes decoupled from items**: Recipes should be their own type and not extend from item types. Reference items by `id` only.
- **Unique Recipe ID**: Use a string `id` for each recipe. This allows referencing and lookup without ambiguity.
- **Output Reference**: Store the `outputId` as a string, referencing the item produced.
- **Requirements**: Use an array of `RecipeRequirement`, each containing an `itemId` and `count`.
- **Workbench & Tier**: Store `workbench` as a string (or `null`) and `workbenchTier` as a number. Enforce valid workbench names through a union type or enum.
- **Craft Time & Output Count**: Store `craftTime` (seconds, optional) and `outputCount` (default 1).
- **Locked Flag**: Boolean `locked` indicates if recipe must be unlocked via item acquisition.
- **Sources**: Use an optional `sources` array, inheriting and extending the `ItemSource` structure.

### b. TypeScript Example

```typescript
// RecipeRequirement
export interface RecipeRequirement {
  itemId: string;
  count: number;
}

// Valid workbench names
export type WorkbenchName = "basic" | "advanced" | "chemistry" | null;

// Recipe
export interface Recipe {
  id: string;
  outputId: string;
  outputCount?: number; // defaults to 1 if omitted
  requirements: RecipeRequirement[];
  workbench: WorkbenchName;
  workbenchTier: number;
  craftTime?: number; // seconds
  locked: boolean;
  sources?: ItemSource[]; // Extendable for new source types
}
```

### c. Extending ItemSource
- Use discriminated unions for extensibility.
- Example extension:
  ```typescript
  export type ItemSource =
    | { type: "buy"; trader: TraderName; value: number; count?: number }
    | { type: "recycle"; fromItemId: string; count: number }
    | { type: "crafted"; recipeId: string };
  ```

---

## 2. Best Practices for Data Management

- **Centralize Recipes**: Store all recipes in a single source (e.g., `recipeData.ts`).
- **Reference, Don’t Duplicate**: Only reference item IDs in recipes, not full item objects.
- **Validation**: Ensure all referenced item IDs and workbench names are valid at build time.
- **Optional Fields**: Use `?` for optional fields and provide sensible defaults in logic.

---

## 3. Handlers & Access Patterns

### a. Retrieving a Recipe by Output Item
- Create a lookup map `{ [outputId: string]: Recipe }` for fast access.
- Example:
  ```typescript
  const recipeByOutputId = new Map<string, Recipe>();
  recipes.forEach(r => recipeByOutputId.set(r.outputId, r));
  ```

### b. Getting All Recipes for an Item
- Filter recipes by `outputId` or by presence in `requirements`.

### c. Resolving Item Details for a Recipe
- When displaying a recipe, resolve `itemId` in requirements/output to the actual item via the item map.

### d. Handling Locked Recipes
- Check the `locked` flag and gate access in UI/logic accordingly.
- Unlock recipes when the corresponding item is acquired.

### e. Handling Sources
- Use discriminated unions and type guards for robust handling of source types.
- Extend `ItemSource` as new acquisition methods are introduced.

---

## 4. Formatting & Style

- **Use PascalCase for types and interfaces.**
- **Use camelCase for fields.**
- **Document all fields with comments.**
- **Keep types in `types/recipes.ts` and data in `data/recipes.ts` for separation of concerns.**

---

## 5. Example Recipe Entry

```typescript
const bandageRecipe: Recipe = {
  id: "craft_bandage",
  outputId: "bandage",
  outputCount: 2,
  requirements: [
    { itemId: "cloth", count: 3 },
    { itemId: "alcohol", count: 1 }
  ],
  workbench: "basic",
  workbenchTier: 1,
  craftTime: 10,
  locked: false,
  sources: [
    { type: "buy", trader: "Tian Wen", value: 50 }
  ]
};
```

---

## 6. Summary

- **Keep recipes and items decoupled.**
- **Use references, not embedded objects.**
- **Validate all IDs and enums at build time.**
- **Use discriminated unions for extensibility.**
- **Centralize and document all types and data.**
