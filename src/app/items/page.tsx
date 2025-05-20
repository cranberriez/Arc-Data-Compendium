"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ItemCard } from "@/components/items/itemDisplay";
import { useItems } from "@/contexts/itemContext";

const ITEMS_PER_PAGE = 10; // Number of items to load per page

function ItemList() {
	const { filteredItems } = useItems();
	const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
	const loader = useRef<HTMLDivElement>(null);
	const observer = useRef<IntersectionObserver | null>(null);

	// Handle loading more items
	const loadMoreItems = useCallback(() => {
		setVisibleItems((prev) => {
			const newCount = Math.min(prev + ITEMS_PER_PAGE, filteredItems.length);
			return newCount;
		});
	}, [filteredItems.length]);

	// Force-load more items if loader is visible and not enough items to fill viewport
	useEffect(() => {
		function isLoaderVisible() {
			if (!loader.current) return false;
			const rect = loader.current.getBoundingClientRect();
			return rect.top < window.innerHeight && rect.bottom >= 0;
		}
		if (visibleItems < filteredItems.length && isLoaderVisible()) {
			// Give the DOM a tick to render, then load more
			setTimeout(() => loadMoreItems(), 0);
		}
	}, [filteredItems.length, visibleItems, loadMoreItems]);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		if (observer.current) {
			observer.current.disconnect();
		}

		const handleIntersect = (entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting) {
				loadMoreItems();
			}
		};

		// Create new observer
		observer.current = new IntersectionObserver(handleIntersect, {
			root: null,
			rootMargin: "100px",
			threshold: 0.1,
		});

		const currentLoader = loader.current;
		if (currentLoader) {
			observer.current.observe(currentLoader);
		}

		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, [loadMoreItems]);

	// Reset visible items when filtered items change
	useEffect(() => {
		setVisibleItems(ITEMS_PER_PAGE);
	}, [filteredItems]);

	// Only render visible items and check if there are more to load
	const itemsToRender = filteredItems.slice(0, visibleItems);
	const hasMoreItems = visibleItems < filteredItems.length;
	const loading = visibleItems < filteredItems.length;

	return (
		<main className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8 p-4 w-full">
			{itemsToRender.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* Loader ref - this is what triggers loading more items */}
			<div
				ref={loader}
				className="h-1 w-full"
				style={{ visibility: "hidden" }}
			/>

			{/* Loading indicator */}
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
