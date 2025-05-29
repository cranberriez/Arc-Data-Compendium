// Component for a single source item
import { Item } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "@/components/items/ItemCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
	const isMobile = useIsMobile();
	const size = isMobile ? "sm" : "sm";

	// Get recycle products for this sourceItem
	const recycleProducts = (sourceItem.recycling || [])
		.map((recycle) => getItemById(recycle.id))
		.filter(Boolean)
		.filter((recycledItem) => recycledItem && recycledItem.id !== item.id);

	return (
		<div className="flex flex-row items-center gap-1 sm:gap-2 cursor-default border-2 border-dashed border-accent rounded-md">
			<ItemCard
				item={sourceItem}
				variant="compact"
				size={size}
			/>
			<ArrowRight className="size-4" />
			<ItemCard
				item={item}
				variant="compact"
				onClick={() => {}}
				count={source.count}
				innerCount={true}
				size={size}
				className={"cursor-default bg-accent border-2 border-accent hover:border-accent/50"}
			/>
			{recycleProducts.length > 0 && (
				<div className="flex flex-row items-center gap-1 ml-2">
					{recycleProducts.map((recycledItem) => {
						if (!recycledItem) return null;
						return (
							<ItemCard
								key={recycledItem.id}
								item={recycledItem}
								variant="compact"
								count={source.count}
								innerCount={true}
								size={size}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
