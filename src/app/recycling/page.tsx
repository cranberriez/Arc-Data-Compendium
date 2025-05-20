"use client";

import { ItemCard } from "@/components/items/itemDisplay";
import { useFilteredItems } from "@/contexts/itemContext";

function ValuableList() {
	const { filteredItems } = useFilteredItems((item) => item.category === "recyclable");
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-4">
			{/* Example placeholder valuable */}
			<ItemCard />
			{/* <ItemCard item={filteredItems[0]} /> */}
			{filteredItems.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* A bunch of empty slots */}
			{Array.from({ length: 22 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-center rounded-md border-2 border-dashed border-muted text-muted-foreground w-full h-16"
				>
					<span className="text-sm">Placeholder {i + 1}</span>
				</div>
			))}
		</main>
	);
}

function ValuablePage() {
	return <ValuableList />;
}

export default ValuablePage;
