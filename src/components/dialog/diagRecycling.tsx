import { Item } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "@/components/items/ItemCard";
import { Recycle, ArrowRight } from "lucide-react";

export const RecyclingSection = ({ item }: { item: Item }) => {
	const { getItemById } = useItems();

	if (!item.recycling || item.recycling.length === 0) return null;

	return (
		<div className="flex flex-col w-fit min-w-full gap-2">
			<div className="font-mono font-light w-full flex items-center gap-2 mb-2">
				<Recycle
					className="inline-block"
					size={24}
				/>
				<div className="flex md:flex-row flex-col w-full items-baseline">
					<p>
						<span className="inline-block text-lg">Recycling:</span>
						<span className="text-xs text-muted-foreground">
							{" "}
							({item.recycling.length})
						</span>
					</p>
					<p className="text-xs text-muted-foreground md:ml-auto whitespace-nowrap">
						In Raid output is halved
					</p>
				</div>
			</div>
			<div className="flex flex-row items-center gap-2">
				<ItemCard
					item={item}
					variant="compact"
					onClick={() => {}}
					innerCount={true}
					size="sm"
					className={
						"cursor-default bg-accent border-2 border-accent hover:border-accent/50"
					}
				/>
				<ArrowRight className="size-4" />
				{item.recycling
					.filter((recycle) => recycle.role === "output")
					.map((recycle, idx) => {
						const recycledItem = getItemById(recycle.itemId);
						if (!recycledItem) return null;
						return (
							<ItemCard
								key={recycle.itemId + idx}
								item={recycledItem}
								variant="compact"
								size="sm"
								count={recycle.qty}
							/>
						);
					})}
			</div>
		</div>
	);
};
