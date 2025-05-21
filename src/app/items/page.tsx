"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ItemCard } from "@/components/items/itemDisplay";
import { useItems } from "@/contexts/itemContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 3; // Number of items to load per page
const DEBUG_LOADING_DELAY = 5; // Delay in ms to simulate loading

function ItemList() {
	const { filteredItems } = useItems();
	const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const loader = useRef<HTMLDivElement>(null);
	const observer = useRef<IntersectionObserver | null>(null);

	// Load more items with delayed loading for debug visualization
	const loadMoreItems = useCallback(() => {
		// Don't load more if we're already at the end
		if (visibleItems >= filteredItems.length) return;

		// Don't load more if we're already loading
		if (isLoading) return;

		console.log("Loading more items...", {
			current: visibleItems,
			total: filteredItems.length,
		});

		// Set loading state
		setIsLoading(true);

		// Add a delay for debugging purposes
		setTimeout(() => {
			setVisibleItems((prev) => {
				const newCount = Math.min(prev + ITEMS_PER_PAGE, filteredItems.length);
				console.log("Loaded new items", { previous: prev, new: newCount });
				return newCount;
			});
			setIsLoading(false);
		}, DEBUG_LOADING_DELAY);
	}, [isLoading, visibleItems, filteredItems.length]);

	// Check if we need to load more items when scroll position changes
	const checkIfNeedsMoreItems = useCallback(() => {
		if (isLoading) return;

		// If we've loaded all items, nothing more to do
		if (visibleItems >= filteredItems.length) return;

		// Check if the loader element is in the viewport or close to it
		if (loader.current) {
			const rect = loader.current.getBoundingClientRect();
			const isNearViewport = rect.top < window.innerHeight + 400;

			if (isNearViewport) {
				console.log("Loader is near viewport, loading more items");
				loadMoreItems();
			}
		}
	}, [isLoading, visibleItems, filteredItems.length, loadMoreItems]);

	// Reset visible items when filtered items change
	useEffect(() => {
		console.log("Filtered items changed, resetting to first page");
		setVisibleItems(ITEMS_PER_PAGE);
		setIsLoading(false);
	}, [filteredItems]);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		// Clean up previous observer
		if (observer.current) {
			observer.current.disconnect();
			observer.current = null;
		}

		console.log("Setting up intersection observer");

		// Create new observer with more generous margins
		observer.current = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isLoading) {
					console.log("Intersection observer triggered");
					loadMoreItems();
				}
			},
			{
				root: null,
				rootMargin: "400px 0px 400px 0px", // Much more aggressive loading margin
				threshold: 0.1,
			}
		);

		// Observe loader element
		if (loader.current) {
			observer.current.observe(loader.current);
			console.log("Now observing loader element");
		}

		// Cleanup on unmount
		return () => {
			if (observer.current) {
				observer.current.disconnect();
				observer.current = null;
			}
		};
	}, [loadMoreItems]); // Only re-create observer when loadMoreItems changes

	// Add scroll event listener as backup
	useEffect(() => {
		// Check on initial load
		checkIfNeedsMoreItems();

		// Add scroll listener
		window.addEventListener("scroll", checkIfNeedsMoreItems, { passive: true });

		// Clean up
		return () => {
			window.removeEventListener("scroll", checkIfNeedsMoreItems);
		};
	}, [checkIfNeedsMoreItems]);

	// Create a skeleton card to show during loading
	const ItemCardSkeleton = () => {
		return (
			<Card className="flex flex-row items-center gap-2 p-1 pr-2 max-w-[300px] md:max-w-[400px] rounded-lg w-full h-16 bg-transparent border-zinc-700">
				{/* Item Icon Skeleton */}
				<div className="flex items-center justify-center rounded-md h-full border-2 border-secondary/30 p-2 bg-secondary/5">
					<Skeleton className="h-full aspect-square w-8" />
				</div>
				<div className="flex flex-col flex-1 w-full h-full gap-2">
					<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-4 rounded-full" />
					</div>
					<div className="min-w-fit flex flex-1 flex-row items-center gap-3">
						<Skeleton className="h-3 w-[40px]" />
						<Skeleton className="h-3 w-[40px]" />
					</div>
				</div>
			</Card>
		);
	};

	// Items to render and loading state
	const itemsToRender = filteredItems.slice(0, visibleItems);
	const loading = isLoading || visibleItems < filteredItems.length;

	return (
		<main className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8 p-4 w-full">
			{/* Rendered items */}
			{itemsToRender.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* Ghost skeleton items - only show when actively loading and more items exist */}
			{isLoading && visibleItems < filteredItems.length && (
				<>
					{[...Array(3)].map((_, index) => (
						<div
							key={`skeleton-${index}`}
							className="animate-pulse"
						>
							<ItemCardSkeleton />
						</div>
					))}
				</>
			)}

			{/* Loader ref - this is what triggers loading more items */}
			<div
				ref={loader}
				className="h-1 w-full"
				style={{
					visibility: "hidden",
					position: "relative",
					top: "-200px",
				}}
			/>

			{/* Loading text indicator */}
			{loading && (
				<div className="col-span-full flex justify-center py-4">
					<div className="animate-pulse text-muted-foreground">Loading more items...</div>
				</div>
			)}
		</main>
	);
}

function ItemPage() {
	return <ItemList />;
}

export default ItemPage;
