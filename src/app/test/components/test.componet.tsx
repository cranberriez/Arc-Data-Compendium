"use client";

import ItemCard from "@/components/items/ItemCard";
import { useDataStore } from "@/stores/dataStore";

function Test() {
	const { items } = useDataStore();

	return (
		<div>
			<ItemCard item={items[0]} />
		</div>
	);
}

export default Test;
