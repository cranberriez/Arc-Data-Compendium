# Item Dialog Component Outline

This document provides a comprehensive outline of the Item Dialog component, detailing every section, the relevant data displayed, subcomponents, typings, and design considerations, including the use of shadcn/ui components.

---

## Overview

The `ItemDialog` presents detailed information about an item. It is modal-based, using the `Dialog` and `DialogContent` components from shadcn/ui. The dialog adapts its content based on the item's properties (sources, recycling, quick use, gear, etc.), and is composed of several modular sections.

### Typings Used

-   **ItemDialogProps**: `{ data: Item; isOpen: boolean; closeDialog: () => void; backDialog: () => void; }`
-   **Item**: Main data type for the item being displayed (imported from `@/types`).

---

## Main Structure

-   **Dialog** (shadcn/ui): Root modal component.
    -   **DialogContent**: Container for all dialog content.
        -   **Back Button** (`Button` from shadcn/ui): Appears if there is a dialog queue for navigation.
        -   **ItemHeader**: Displays core item info (icon, name, category, rarity, craftable status).
        -   **DialogDescription**: Accessible description for screen readers and visible description text.
        -   **Section Divider**: Horizontal rule, conditionally rendered if any of the following sections are present.
        -   **QuickUseSection**: If the item has quick use stats.
        -   **GearSection**: If the item is gear.
        -   **RecyclingSection**: If the item can be recycled.
        -   **SourcesSection**: If the item has sources.

---

## Section Details

### 1. Back Button

-   **Component**: `Button` (shadcn/ui)
-   **Logic**: Shown if `dialogQueue.length > 0` (for dialog navigation).
-   **Data**: Previous dialog's item name.

### 2. ItemHeader

-   **Component**: Custom, uses `DialogHeader` and `DialogTitle` (shadcn/ui)
-   **Data**: Item icon, name, category, rarity, and recipe/craftable status.
-   **Design**: Uses color coding for rarity, icons for item type, and a book icon if craftable.
-   **Typing**: `{ item: Item }`

### 3. DialogDescription

-   **Component**: `DialogDescription` (shadcn/ui)
-   **Data**: Accessible description for screen readers and the item's description text.

### 4. Section Divider

-   **Component**: `<hr>` (styled)
-   **Logic**: Rendered if any of QuickUse, Gear, Recycling, or Sources sections are present.

### 5. QuickUseSection

-   **Component**: Custom
-   **Data**: `item.quickUse` (stats, charge, flavorText)
-   **Subcomponents**:
    -   **StatItem**: Renders individual quick use stats with icons (e.g., healing, damage).
    -   **Charge**: Displays charge details if present.
-   **Typing**: `{ item: Item }`
-   **Design**: Uses Lucide icons and color accents for quick use stats.

### 6. GearSection

-   **Component**: Custom
-   **Data**: `item.gear` (varies by gear type)
-   **Subcomponents**:
    -   **StatRow**: Renders gear stats with icons and formatted labels.
    -   **ShieldSection**, **AugmentSection**: Specialized subcomponents for certain gear types.
-   **Typing**: `{ item: Item }`
-   **Design**: Uses Lucide icons, color coding, and formatted stat names.

### 7. RecyclingSection

-   **Component**: Custom
-   **Data**: `item.recycling` (array of recycled items and counts)
-   **Subcomponents**:
    -   **ItemCard**: Displays recycled item icons and counts.
-   **Typing**: `{ item: Item }`
-   **Design**: Uses Lucide `Recycle` icon, item cards for each recycled output.

### 8. SourcesSection

-   **Component**: Custom
-   **Data**: `item.sources` (array of sources, filtered/sorted)
-   **Subcomponents**:
    -   **SourceItem**: Displays each source as an item card.
    -   **ScrollArea**: Used for scrollable source lists.
    -   **Show more/less**: Button to expand/collapse the source list if long.
-   **Typing**: `{ item: Item }`
-   **Design**: Uses Lucide `Link` icon, two-column layout, scroll area for overflow.

---

## Design Considerations

-   **Accessibility**: Uses `DialogDescription` for screen readers.
-   **Responsiveness**: Uses flex layouts and responsive paddings.
-   **Visual Hierarchy**: Section headers, icons, and color coding for clarity.
-   **Modularity**: Each section is a separate component, making the dialog extensible.
-   **shadcn/ui**: Used for dialog, button, and description primitives, ensuring consistent styling and accessibility.
-   **Lucide Icons**: Used throughout for visual cues (item type, rarity, actions).

---

## Summary Table

| Section     | Component(s)      | Data Source    | Typing         | shadcn/ui Components      |
| ----------- | ----------------- | -------------- | -------------- | ------------------------- |
| Back Button | Button            | dialogQueue    | -              | Button                    |
| Header      | ItemHeader        | item           | { item: Item } | DialogHeader, DialogTitle |
| Description | DialogDescription | item           | -              | DialogDescription         |
| Divider     | hr                | -              | -              | -                         |
| Quick Use   | QuickUseSection   | item.quickUse  | { item: Item } | -                         |
| Gear        | GearSection       | item.gear      | { item: Item } | -                         |
| Recycling   | RecyclingSection  | item.recycling | { item: Item } | -                         |
| Sources     | SourcesSection    | item.sources   | { item: Item } | ScrollArea, Button        |

---

## Extensibility

The modular structure allows for easy addition or modification of sections. Each section can be independently updated to support new item features or data types.

---

## References

-   [shadcn/ui documentation](https://ui.shadcn.com/)
-   [Lucide Icons](https://lucide.dev/)
-   Project typings in `@/types`
-   Dialog subcomponents in `src/components/dialog/`
