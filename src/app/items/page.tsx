"use client";

import { items } from "@/data/items/items";
import { ItemCard } from "@/components/items/item";

function ItemPage() {
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-4">
			<ItemCard />
			{/* <ItemCard item={items[0]} /> */}
			{items.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}
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

export default ItemPage;
