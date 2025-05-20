"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ItemCard } from "@/components/items/itemDisplay";
import { useItems } from "@/contexts/itemContext";

const ITEMS_PER_PAGE = 30; // Number of items to load per page

function ItemList() {
	const { filteredItems } = useItems();
	const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
	const loader = useRef<HTMLDivElement>(null);
	const loadingRef = useRef<boolean>(false);

	// Handle infinite scroll
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && !loadingRef.current) {
				loadingRef.current = true;
				// Load more items when the loader is visible
				setVisibleItems((prev) => {
					const newCount = Math.min(prev + ITEMS_PER_PAGE, filteredItems.length);
					loadingRef.current = false;
					return newCount;
				});
			}
		},
		[filteredItems.length]
	);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "20px",
			threshold: 0.1,
		});

		const currentLoader = loader.current;
		if (currentLoader) {
			observer.observe(currentLoader);
		}

		// Reset visible items when filtered items change
		setVisibleItems(ITEMS_PER_PAGE);

		return () => {
			if (currentLoader) {
				observer.unobserve(currentLoader);
			}
		};
	}, [filteredItems, handleObserver]);

	// Only render visible items
	const itemsToRender = filteredItems.slice(0, visibleItems);

	return (
		<main className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-4 w-full">
			{itemsToRender.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* Loading indicator (hidden until needed) */}
			<div
				ref={loader}
				className="col-span-full flex justify-center py-4"
				style={{
					visibility: visibleItems < filteredItems.length ? "visible" : "hidden",
				}}
			>
				<div className="animate-pulse text-muted-foreground">Loading more items...</div>
			</div>
		</main>
	);
}

function ItemPage() {
	return <ItemList />;
}

export default ItemPage;
