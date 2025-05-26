import { fetchItems, fetchValuables } from "@/services/dataService";
import { ItemList } from "@/components/items/ItemsList";

// Remove "use client" directive to make this a server component
export default async function ItemsPage() {
	// Fetch only the data needed for this page
	const items = await fetchItems();
	const valuables = await fetchValuables();

	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-6 gap-y-8 min-h-full w-full py-8 px-2 sm:px-4 smooth-scroll">
			<h1 className="sr-only">All Items</h1>
			<ItemList initialItems={[...items, ...valuables]} />
		</main>
	);
}
