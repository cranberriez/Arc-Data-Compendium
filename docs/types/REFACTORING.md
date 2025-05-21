# Arc Data Compendium - Refactoring Recommendations

This document outlines recommendations for refactoring the Arc Data Compendium codebase to improve code reuse, maintainability, and readability.

## Table of Contents

1. [UI Component Extraction](#ui-component-extraction)
2. [Tooltip Simplification](#tooltip-simplification)
3. [Item Property Display Components](#item-property-display-components)
4. [Infinite Scroll Hook](#infinite-scroll-hook)
5. [Item Data Structure Factories](#item-data-structure-factories)
6. [Utility Function Generalization](#utility-function-generalization)
7. [Component Responsibility Separation](#component-responsibility-separation)
8. [Memoization Strategy](#memoization-strategy)

## UI Component Extraction

### Issue

In `ItemDisplay.tsx` and `itemDialog.tsx`, there's repetition of styling logic for item cards and icons:

```tsx
// In both files, similar styling logic is used:
<div
	className={cn(
		"flex items-center justify-center rounded-lg border-2 p-2",
		getRarityColor(item.rarity, "border"),
		getRarityColor(item.rarity, "text"),
		`dark:${getRarityColor(item.rarity, "bg")}/10`
	)}
/>
```

### Recommendation

Create a reusable `ItemIcon` component that handles the styling consistently:

```tsx
// components/items/ItemIcon.tsx
export function ItemIcon({ item, size = "md", className }) {
	if (!item?.icon) return null;
	const ItemIconComponent = item.icon;

	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-8 h-8",
		lg: "w-10 h-10",
	};

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-lg border-2 p-2",
				getRarityColor(item.rarity, "border"),
				`dark:${getRarityColor(item.rarity, "bg")}/10`,
				className
			)}
		>
			<ItemIconComponent
				className={cn(
					sizeClasses[size] || sizeClasses.md,
					getRarityColor(item.rarity, "text")
				)}
			/>
		</div>
	);
}
```

## Tooltip Simplification

### Issue

Tooltip patterns are repeated in multiple components with similar structure:

```tsx
<TooltipProvider>
	<Tooltip>
		<TooltipTrigger>{/* Content */}</TooltipTrigger>
		<TooltipContent side="right">
			<span>{content}</span>
		</TooltipContent>
	</Tooltip>
</TooltipProvider>
```

### Recommendation

Create a simplified tooltip component:

```tsx
// components/ui/SimpleTooltip.tsx
export function SimpleTooltip({ children, content, side = "right" }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent side={side}>
					<span>{content}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
```

Usage example:

```tsx
<SimpleTooltip content={formatName(item.category)}>
	{React.createElement(getTypeIcon(item.category), { size: 16 })}
</SimpleTooltip>
```

## Item Property Display Components

### Issue

In `ItemDisplay.tsx`, there's repetition for displaying item properties (weight, value, etc.):

```tsx
<div className="text-sm text-muted-foreground flex items-center gap-1">
	<Weight
		size={12}
		strokeWidth={4}
	/>
	<span className="text-sm font-mono tabular-nums">{item.weight}kg</span>
</div>
```

### Recommendation

Create a reusable `ItemProperty` component:

```tsx
// components/items/ItemProperty.tsx
export function ItemProperty({ icon: Icon, value, unit = "", className }) {
	return (
		<div className={cn("text-sm text-muted-foreground flex items-center gap-1", className)}>
			<Icon
				size={12}
				strokeWidth={4}
			/>
			<span className="text-sm font-mono tabular-nums">
				{value}
				{unit}
			</span>
		</div>
	);
}
```

Usage example:

```tsx
<ItemProperty icon={Weight} value={item.weight} unit="kg" />
<ItemProperty icon={ShoppingCart} value={`$${item.value}`} />
```

## Infinite Scroll Hook

### Issue

The infinite scroll implementation in `items/page.tsx` is complex and could be extracted for reuse in other listing pages.

### Recommendation

Create a reusable `useInfiniteScroll` hook:

```tsx
// hooks/useInfiniteScroll.ts
export function useInfiniteScroll<T>({ items, itemsPerPage = 10, loadingDelay = 0 }) {
	const [visibleItems, setVisibleItems] = useState<number>(itemsPerPage);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const loader = useRef<HTMLDivElement>(null);
	const observer = useRef<IntersectionObserver | null>(null);

	// Load more items logic
	const loadMoreItems = useCallback(() => {
		if (visibleItems >= items.length || isLoading) return;

		setIsLoading(true);
		setTimeout(() => {
			setVisibleItems((prev) => Math.min(prev + itemsPerPage, items.length));
			setIsLoading(false);
		}, loadingDelay);
	}, [isLoading, visibleItems, items.length, loadingDelay, itemsPerPage]);

	// Reset when items change
	useEffect(() => {
		setVisibleItems(itemsPerPage);
		setIsLoading(false);
	}, [items, itemsPerPage]);

	// Set up intersection observer
	useEffect(() => {
		// Clean up previous observer
		if (observer.current) {
			observer.current.disconnect();
		}

		observer.current = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isLoading) {
					loadMoreItems();
				}
			},
			{
				rootMargin: "400px 0px",
				threshold: 0.1,
			}
		);

		if (loader.current) {
			observer.current.observe(loader.current);
		}

		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, [loadMoreItems, isLoading]);

	return {
		itemsToRender: items.slice(0, visibleItems),
		isLoading,
		loaderRef: loader,
		hasMore: visibleItems < items.length,
	};
}
```

Usage example:

```tsx
function ItemList() {
  const { filteredItems } = useItems();
  const {
    itemsToRender,
    isLoading,
    loaderRef,
    hasMore
  } = useInfiniteScroll({
    items: filteredItems,
    itemsPerPage: 10,
    loadingDelay: 5
  });

  return (
    <main className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8 p-4 w-full">
      {itemsToRender.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}

      {/* Loading skeletons */}
      {isLoading && /* render skeletons */}

      {/* Loader reference element */}
      <div ref={loaderRef} className="h-1 w-full" />
    </main>
  );
}
```

## Item Data Structure Factories

### Issue

The `itemsData` array in `itemData.ts` contains a lot of repetitive structure and could benefit from factory functions.

### Recommendation

Create item factory functions to reduce repetition:

```tsx
// data/items/itemFactory.ts
export function createRecyclableItem(
	props: Partial<Item> & { id: string; name: string; icon: LucideIcon }
): Item {
	return {
		category: "recyclable",
		rarity: "common",
		description: "No provided description for this item yet.",
		weight: 1,
		maxStack: 1,
		recipe: null,
		sources: [],
		value: 0,
		...props,
	};
}

export function createConsumableItem(
	props: Partial<Item> & { id: string; name: string; icon: LucideIcon }
): Item {
	return {
		category: "quick_use",
		rarity: "common",
		weight: 0.2,
		maxStack: 5,
		recipe: null,
		sources: [],
		value: 10,
		...props,
	};
}
```

Usage example:

```tsx
export const itemsData: Item[] = [
	createRecyclableItem({
		id: "arc_powercells",
		name: "ARC Powercells",
		icon: BatteryFull,
	}),
	createRecyclableItem({
		id: "chemicals",
		name: "Chemicals",
		icon: FlaskConical,
	}),
	createConsumableItem({
		id: "lemon",
		name: "Lemon",
		icon: Citrus,
		description: "Can be consumed for a small amount of stamina",
		weight: 0.2,
		maxStack: 10,
	}),
	// ...
];
```

## Utility Function Generalization

### Issue

Some utility functions in `itemUtils.ts` could be more generalized for broader use.

### Recommendation

Extract the `formatName` function to a general utility file since it's not specific to items:

```tsx
// utils/formatters.ts
export const formatName = (type: string) => {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};
```

Usage example:

```tsx
import { formatName, formatCurrency } from "@/utils/formatters";

// In component
<span>{formatName(item.category)}</span>
<span>{formatCurrency(item.value)}</span>
```

## Component Responsibility Separation

### Issue

The `ItemDialog` component in `itemDialog.tsx` handles too many responsibilities: navigation, display, and data fetching.

### Recommendation

Split the component into smaller, focused components:

```tsx
// components/items/ItemDialogHeader.tsx
export function ItemDialogHeader({ item }) {
	return (
		<DialogHeader className="flex flex-row items-center gap-4">
			<ItemIcon
				item={item}
				size="lg"
			/>
			<div className="flex flex-col items-start">
				<DialogTitle className="text-2xl font-mono font-light">{item.name}</DialogTitle>
				<ItemProperties item={item} />
			</div>
		</DialogHeader>
	);
}

// components/items/ItemDialogNavigation.tsx
export function ItemDialogNavigation({ dialogQueue, onBack }) {
	if (dialogQueue.length === 0) return null;

	return (
		<div>
			<Button
				variant="secondary"
				onClick={onBack}
				className="px-3 py-1 cursor-pointer"
			>
				← Back to {dialogQueue[dialogQueue.length - 1].name}
			</Button>
		</div>
	);
}

// components/items/ItemRecyclingSection.tsx
export function ItemRecyclingSection({ item, onItemClick }) {
	if (!item.recycling || item.recycling.length === 0) return null;

	return (
		<div>
			<p className="font-mono font-light mb-2">Recycles Into:</p>
			<div className="flex flex-row items-center gap-2">
				{item.recycling.map((recycle, idx) => {
					const recycledItem = getItemById(recycle.id);
					if (!recycledItem) return null;
					return (
						<ItemCard
							key={recycle.id + idx}
							item={recycledItem}
							variant="icon"
							count={recycle.count}
							onClick={() => onItemClick(recycledItem)}
						/>
					);
				})}
			</div>
		</div>
	);
}
```

Usage in main component:

```tsx
export function ItemDialog({ data, isOpen, closeDialog }) {
	// Hooks and state

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && handleCloseDialog()}
		>
			<DialogContent className="w-[95vw] max-h-[95vh]">
				<ItemDialogNavigation
					dialogQueue={dialogQueue}
					onBack={handleBack}
				/>
				<ItemDialogHeader item={data} />

				{/* Divider */}
				{(data.recycling || data.sources) && <ItemDialogDivider />}

				<ItemRecyclingSection
					item={data}
					onItemClick={(item) => {
						setDialogQueue((prev) => [...prev, data]);
						openDialog("item", item);
					}}
				/>

				<ItemSourcesSection
					item={data}
					onItemClick={(item) => {
						setDialogQueue((prev) => [...prev, data]);
						openDialog("item", item);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
```

## Memoization Strategy

### Issue

The memoization in `ItemDisplay.tsx` could be more consistent and better organized.

### Recommendation

Extract memoization logic to custom hooks or consistent patterns:

```tsx
// hooks/useItemDisplay.ts
export function useItemDisplay(item: Item | undefined) {
	const itemIcon = useMemo(() => {
		if (!item?.icon) return null;
		return <item.icon className={cn("w-8 h-8", getRarityColor(item.rarity, "text"))} />;
	}, [item?.icon, item?.rarity]);

	const borderClass = useMemo(
		() => (item ? getRarityColor(item.rarity, "border") : undefined),
		[item?.rarity]
	);

	const backgroundClass = useMemo(
		() => (item ? `${getRarityColor(item.rarity, "bg")}/10` : undefined),
		[item?.rarity]
	);

	return {
		itemIcon,
		borderClass,
		backgroundClass,
	};
}
```

Usage example:

```tsx
function ItemCard({ item, variant = "default" }) {
	const { itemIcon, borderClass, backgroundClass } = useItemDisplay(item);

	// Component rendering logic
}
```

## Implementation Plan

1. **Phase 1: Extract UI Components**

    - Create `ItemIcon`, `SimpleTooltip`, and `ItemProperty` components
    - Update existing components to use these new components

2. **Phase 2: Extract Hooks**

    - Create `useInfiniteScroll` and `useItemDisplay` hooks
    - Refactor components to use these hooks

3. **Phase 3: Utility Functions**

    - Move general utility functions to appropriate files
    - Update imports across the codebase

4. **Phase 4: Component Splitting**

    - Break down larger components into smaller, focused components
    - Update parent components to use these new components

5. **Phase 5: Data Structure Refactoring**
    - Create item factory functions
    - Refactor item data to use these factories
