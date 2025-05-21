// Component for a single source item
import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "../itemDisplay";
import { ArrowRight } from "lucide-react";

export const SourceItem = ({
	sourceItem,
	item,
	source,
}: {
	sourceItem: Item;
	item: Item;
	source: any;
}) => {
	const { getItemById } = useItems();
	const { openDialog, setDialogQueue } = useDialog();

	// Get recycle products for this sourceItem
	const recycleProducts = (sourceItem.recycling || [])
		.map((recycle) => getItemById(recycle.id))
		.filter(Boolean)
		.filter((recycledItem) => recycledItem && recycledItem.id !== item.id);

	return (
		<div className="flex flex-row items-center gap-2">
			<ItemCard
				item={sourceItem}
				variant="icon"
				onClick={() => {
					setDialogQueue((prev) => [...prev, item]);
					openDialog("item", sourceItem);
				}}
			/>
			<ArrowRight className="size-4" />
			<ItemCard
				item={item}
				variant="icon"
				onClick={() => {}}
				count={source.count}
				className="cursor-default bg-accent border-2 border-accent hover:border-accent/50"
			/>
			{recycleProducts.length > 0 && (
				<div className="flex flex-row items-center gap-1 ml-2">
					{recycleProducts.map((recycledItem) => {
						if (!recycledItem) return null;
						return (
							<ItemCard
								key={recycledItem.id}
								item={recycledItem}
								variant="icon"
								count={source.count}
								onClick={() => {
									setDialogQueue((prev) => [...prev, item]);
									openDialog("item", recycledItem);
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
