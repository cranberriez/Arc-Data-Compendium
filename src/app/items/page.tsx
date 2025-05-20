"use client";

import { ItemCard } from "@/components/items/itemDisplay";
import { useItems } from "@/contexts/itemContext";

function ItemList() {
	const { filteredItems } = useItems();
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-4">
			{/* Example placeholder item */}
			<ItemCard />
			{/* <ItemCard item={items[0]} /> */}
			{filteredItems.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}

			{/* A bunch of empty slots */}
			{Array.from({ length: 100 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-center rounded-md border-2 border-dashed border-muted text-muted-foreground w-full h-16 md:max-w-[300px] max-w-[400px]"
				>
					<span className="text-sm">Placeholder {i + 1}</span>
				</div>
			))}
		</main>
	);
}

function ItemPage() {
	return <ItemList />;
}

export default ItemPage;
