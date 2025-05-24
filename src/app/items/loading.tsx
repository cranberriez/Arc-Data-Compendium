import ItemSkeleton from "@/components/items/itemSkeleton";

export default function itemPageLoader() {
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-2 sm:px-4 smooth-scroll">
			<h1 className="sr-only">All Items</h1>
			{[...Array(15)].map((_, index) => (
				<div
					key={`skeleton-${index}`}
					className="animate-pulse"
				>
					<ItemSkeleton />
				</div>
			))}
		</main>
	);
}
