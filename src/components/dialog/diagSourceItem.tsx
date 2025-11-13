// Component for a single source item
import { Item, Recipe } from "@/types";
import { ItemCard } from "@/components/items/ItemCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useItems } from "@/hooks/useData";
import { RecipeQuantity } from "./diagSource";

export const RecycleSourceItem = ({
	sourceRecipe,
	mainItem,
	mainItemQty,
	quantityRange,
}: {
	sourceRecipe: Recipe;
	mainItem: Item;
	mainItemQty: number;
	quantityRange: RecipeQuantity;
}) => {
	const isMobile = useIsMobile();
	const size = isMobile ? "sm" : "sm";
	const { getItemById } = useItems();

	const sourceItem = sourceRecipe.io.filter((io) => io.role === "input")[0];
	if (!sourceItem) return null;

	const coproducts = sourceRecipe.io.filter(
		(io) => io.role === "output" && io.itemId !== mainItem.id
	);

	const mainItemMin = quantityRange.outputs[mainItem.id].minQty;
	const mainItemMax = quantityRange.outputs[mainItem.id].maxQty;

	let mainItemCount = `${mainItemMin}-${mainItemMax}`;
	if (mainItemMin === mainItemMax) {
		mainItemCount = mainItemMin.toString();
	}

	return (
		<div className="flex flex-row items-center gap-1 sm:gap-2 cursor-default border-2 border-dashed border-accent rounded-md">
			<ItemCard item={getItemById(sourceItem.itemId)} variant="compact" size={size} />
			<ArrowRight className="size-4" />
			<ItemCard
				item={mainItem}
				variant="compact"
				onClick={() => {}}
				count={mainItemCount}
				size={size}
				className={"cursor-default bg-accent border-2 border-accent hover:border-accent/50"}
			/>
			{coproducts.length > 0 && (
				<div className="flex flex-row items-center gap-1 ml-2">
					{coproducts.map((coproduct) => {
						if (!coproduct) return null;
						const item = getItemById(coproduct.itemId);
						if (!item) return null;
						const coproductMin = quantityRange.outputs[item.id].minQty;
						const coproductMax = quantityRange.outputs[item.id].maxQty;

						let count = `${coproductMin}-${coproductMax}`;
						if (coproductMin === coproductMax) {
							count = coproductMin.toString();
						}

						return (
							<ItemCard
								key={coproduct.itemId}
								item={item}
								variant="compact"
								count={count}
								size={size}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
