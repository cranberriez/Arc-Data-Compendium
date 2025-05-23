"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ItemCard, ItemCardSkeleton } from "@/components/items/itemDisplay";
import { useItems } from "@/contexts/itemContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 20; // Number of items to load per page
const DEBUG_LOADING_DELAY = 0; // Delay in ms to simulate loading

function ItemList() {
	const { filteredItems } = useItems();
	const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const loader = useRef<HTMLDivElement>(null);
	const observer = useRef<IntersectionObserver | null>(null);
	const debugging = false;

	// Load more items with delayed loading for debug visualization
	const loadMoreItems = useCallback(() => {
		// Don't load more if we're already at the end
		if (visibleItems >= filteredItems.length) return;

		// Don't load more if we're already loading
		if (isLoading) return;

		if (debugging)
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
				if (debugging) console.log("Loaded new items", { previous: prev, new: newCount });
				return newCount;
			});
			setIsLoading(false);
		}, DEBUG_LOADING_DELAY);
	}, [isLoading, visibleItems, filteredItems.length, debugging]);

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
				if (debugging) console.log("Loader is near viewport, loading more items");
				loadMoreItems();
			}
		}
	}, [isLoading, visibleItems, filteredItems.length, loadMoreItems]);

	// Reset visible items when filtered items change
	useEffect(() => {
		if (debugging) console.log("Filtered items changed, resetting to first page");
		setVisibleItems(ITEMS_PER_PAGE);
		setIsLoading(false);
	}, [filteredItems, debugging]);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		// Clean up previous observer
		if (observer.current) {
			observer.current.disconnect();
			observer.current = null;
		}

		if (debugging) console.log("Setting up intersection observer");

		// Create new observer with more generous margins
		observer.current = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isLoading) {
					if (debugging) console.log("Intersection observer triggered");
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
			if (debugging) console.log("Now observing loader element");
		}

		// Cleanup on unmount
		return () => {
			if (observer.current) {
				observer.current.disconnect();
				observer.current = null;
			}
		};
	}, [loadMoreItems, debugging]); // Only re-create observer when loadMoreItems changes

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

	// Items to render and loading state
	const itemsToRender = filteredItems.slice(0, visibleItems);
	const loading = isLoading || visibleItems < filteredItems.length;

	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-4 smooth-scroll">
			{/* Rendered items */}
			{itemsToRender.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* Ghost skeleton items - only show when actively loading */}
			{loading && (
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
