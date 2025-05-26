import { Item } from "@/types";
import { ItemCard } from "./itemDisplay";

interface ItemListProps {
	items: Item[];
}

export function ItemList({ items }: ItemListProps) {
	return items.map((item) => (
		<ItemCard
			key={item.id}
			item={item}
		/>
	));
}
