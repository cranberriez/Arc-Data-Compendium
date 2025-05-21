import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "../itemDisplay";

export const RecyclingSection = ({ item }: { item: Item }) => {
	const { getItemById } = useItems();
	const { openDialog, setDialogQueue } = useDialog();

	if (!item.recycling || item.recycling.length === 0) return null;

	return (
		<div>
			<p className="font-mono font-light mb-2">Recycles Into:</p>
			<div className="flex flex-row items-center gap-2">
				{item.recycling.map((recycle, idx) => {
					const recycledItem = getItemById(recycle.id);
					if (!recycledItem) return null;
					return (
						<ItemCard
							key={recycle.id + idx}
							item={recycledItem}
							variant="icon"
							count={recycle.count}
							onClick={() => {
								setDialogQueue((prev) => [...prev, item]);
								openDialog("item", recycledItem);
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
