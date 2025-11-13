import { Item, RecyclingRecipe } from "@/types";
import { useItems } from "@/hooks/useData";
import { ItemCard } from "@/components/items/ItemCard";
import { Recycle, ArrowRight } from "lucide-react";

export const RecyclingSection = ({
	outputItem,
	recyclingRecipe,
}: {
	outputItem: Item;
	recyclingRecipe: RecyclingRecipe;
}) => {
	const { getItemById } = useItems();

	const outputs = recyclingRecipe.io.filter((io) => io.role === "output");

	return (
		<div className="flex flex-col w-fit min-w-full gap-2">
			<div className="font-mono font-light w-full flex items-center gap-2 mb-2">
				<Recycle className="inline-block" size={24} />
				<div className="flex md:flex-row flex-col w-full items-baseline">
					<p>
						<span className="inline-block text-lg">Recycling:</span>
					</p>
					<p className="text-xs text-muted-foreground md:ml-auto whitespace-nowrap">
						In Raid output may be different
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
				{outputs.map((output, idx) => {
					const recycledItem = getItemById(output.itemId);
					if (!recycledItem) return null;
					return (
						<ItemCard
							key={output.itemId + idx}
							item={recycledItem}
							variant="compact"
							size="sm"
							count={output.qty}
						/>
					);
				})}
			</div>
		</div>
	);
};
