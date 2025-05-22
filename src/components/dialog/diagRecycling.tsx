import { Item } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "../items/itemDisplay";
import { Recycle } from "lucide-react";

export const RecyclingSection = ({ item }: { item: Item }) => {
	const { getItemById } = useItems();
	const { openDialog, setDialogQueue } = useDialog();

	if (!item.recycling || item.recycling.length === 0) return null;

	return (
		<div>
			<div className="font-mono font-light w-full flex items-center gap-2 mb-2">
				<Recycle
					className="inline-block"
					size={24}
				/>
				<div className="flex w-full items-baseline">
					<p>
						<span className="inline-block text-lg">Recycling:</span>
						<span className="text-xs text-muted-foreground">
							{" "}
							({item.recycling.length})
						</span>
					</p>
					<p className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
						In Raid output is halved
					</p>
				</div>
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
