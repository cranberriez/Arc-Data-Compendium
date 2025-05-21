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
			<div className="flex items-center justify-between gap-2 mb-2">
				<p className="font-mono font-light">Recycles Into:</p>
				<p className="text-xs text-muted-foreground">
					Items recycled while in Raid have their output halvedd
				</p>
			</div>
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
