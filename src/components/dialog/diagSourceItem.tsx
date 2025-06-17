// Component for a single source item
import { Item, RecipeRow } from "@/types";
import { ItemCard } from "@/components/items/ItemCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useItems } from "@/contexts/itemContext";

export const RecycleSourceItem = ({
	recycledSource,
	mainItem,
	mainItemQty,
	coproducts,
}: {
	recycledSource: RecipeRow;
	mainItem: Item;
	mainItemQty: number;
	coproducts: RecipeRow[];
}) => {
	const isMobile = useIsMobile();
	const size = isMobile ? "sm" : "sm";
	const { getItemById } = useItems();

	return (
		<div className="flex flex-row items-center gap-1 sm:gap-2 cursor-default border-2 border-dashed border-accent rounded-md">
			<ItemCard
				item={getItemById(recycledSource.itemId)}
				variant="compact"
				size={size}
			/>
			<ArrowRight className="size-4" />
			<ItemCard
				item={mainItem}
				variant="compact"
				onClick={() => {}}
				count={mainItemQty}
				innerCount={true}
				size={size}
				className={"cursor-default bg-accent border-2 border-accent hover:border-accent/50"}
			/>
			{coproducts.length > 0 && (
				<div className="flex flex-row items-center gap-1 ml-2">
					{coproducts.map((coproduct) => {
						if (!coproduct) return null;
						const item = getItemById(coproduct.itemId);
						return (
							<ItemCard
								key={coproduct.itemId}
								item={item}
								variant="compact"
								count={coproduct.qty}
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
