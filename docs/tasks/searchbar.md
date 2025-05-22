# Search Bar Implementation Requirements

## Overview

The searchbar component integrates with the itemContext's search filtering functionality to provide a powerful and intuitive search experience for users. It's accessed via a magnifying glass icon button in the toolbar-breadcrumb component.

## Key Components

1. **Search Button**

    - Located in the toolbar-breadcrumb.tsx file
    - Uses a magnifying glass icon
    - Toggles the search dialog when clicked

2. **Search Dialog**
    - Uses the command dialog component from shadcn UI
    - Searches against the full list of all types of items
    - Uses fuzzy display name matching
    - Does not immediately apply search filtering until item selection

## Search Results Structure

### Group 1: Category Filters

-   Appears when typing more than 1 letter with at least 1 matching result
-   Shows command items for each item type from the available types
-   Initially, shows at least "Item" and "Valuable" types if matches exist
-   Each category gets a command item if there's at least 1 match
-   Displays a count badge showing the number of matches for each category
-   Selecting a category item will:
    -   Apply the search term to the global filter
    -   Apply the category filter
    -   Close the dialog

### Group 2: Individual Items

-   Appears when there are 10 or fewer items in the filtered results
-   Shows a command item for each individual item in the results
-   Each item displays:
    -   The item's icon
    -   The item's name
    -   A colored dot representing its rarity
-   Selecting an item will:
    -   Close the search dialog
    -   Open the item dialog for that specific item

## Technical Implementation Details

1. **State Management**

    - Uses a local search state that doesn't affect global filtering until selection
    - Connects to the itemContext to access items and filtering functionality
    - Provides category counts through a utility function

2. **Search Behavior**

    - Performs case-insensitive search
    - Shows initial results on dialog open
    - Provides different results based on search term length
    - Filters items based on name matches
    - Adapts UI based on result count

3. **UI Elements**
    - Search input with auto-focus
    - Empty state message when no results are found
    - Category grouping with counts
    - Item listing with rarity indicators

## Debugging & Troubleshooting

-   Console logs for tracking item loading
-   Feedback for search result counts
-   Error handling for missing data
-   Fallback UI for empty states

## Integration Points

-   Uses itemContext for data and filtering
-   Uses dialogContext for opening item dialogs
-   Integrated into the toolbar-breadcrumb component
-   Leverages shadcn UI components for consistent styling
