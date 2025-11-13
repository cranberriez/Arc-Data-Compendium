// Component for a single source item
import { Item, Recipe } from "@/types";
import { ItemCard } from "@/components/items/ItemCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useItems } from "@/hooks/useData";

export const RecycleSourceItem = ({
	sourceRecipe,
	mainItem,
	mainItemQty,
}: {
	sourceRecipe: Recipe;
	mainItem: Item;
	mainItemQty: number;
}) => {
	const isMobile = useIsMobile();
	const size = isMobile ? "sm" : "sm";
	const { getItemById } = useItems();

	const sourceItem = sourceRecipe.io.filter((io) => io.role === "input")[0];
	if (!sourceItem) return null;

	const coproducts = sourceRecipe.io.filter(
		(io) => io.role === "output" && io.itemId !== mainItem.id
	);

	return (
		<div className="flex flex-row items-center gap-1 sm:gap-2 cursor-default border-2 border-dashed border-accent rounded-md">
			<ItemCard item={getItemById(sourceItem.itemId)} variant="compact" size={size} />
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
