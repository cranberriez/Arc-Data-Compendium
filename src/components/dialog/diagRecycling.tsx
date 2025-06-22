import { Item, Recipe } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { ItemCard } from "@/components/items/ItemCard";
import { Recycle, ArrowRight } from "lucide-react";

export const RecyclingSection = ({
	outputItem,
	recyclingRecipe,
}: {
	outputItem: Item;
	recyclingRecipe: Recipe;
}) => {
	const { getItemById } = useItems();

	const inputs = recyclingRecipe.io.filter((io) => io.role === "input");
	const outputs = recyclingRecipe.io.filter((io) => io.role === "output"); // Currently unused

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
							({recyclingRecipe.io.length})
						</span>
					</p>
					<p className="text-xs text-muted-foreground md:ml-auto whitespace-nowrap">
						In Raid output is halved
					</p>
				</div>
			</div>
			<div className="flex flex-row items-center gap-2">
				<ItemCard
					item={outputItem}
					variant="compact"
					onClick={() => {}}
					innerCount={true}
					size="sm"
					className={
						"cursor-default bg-accent border-2 border-accent hover:border-accent/50"
					}
				/>
				<ArrowRight className="size-4" />
				{inputs.map((input, idx) => {
					const recycledItem = getItemById(input.itemId);
					if (!recycledItem) return null;
					return (
						<ItemCard
							key={input.itemId + idx}
							item={recycledItem}
							variant="compact"
							size="sm"
							count={input.qty}
						/>
					);
				})}
			</div>
		</div>
	);
};
