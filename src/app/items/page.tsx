import { ItemList } from "./components/itemList";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Items | ARC Vault",
	description: "Full item page for ARC Vault, listing all items in the game.",
};

export default async function ItemsPage() {
	return (
		<main className="grid grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] grid-rows-[repeat(auto-fit)] gap-x-6 gap-y-8 min-h-full w-full py-8 px-2 sm:px-4 smooth-scroll auto-rows-max">
			<h1 className="sr-only">All Items</h1>
			<ItemList />
		</main>
	);
}
