import { Recipe, RecipeItemBase } from "@/types";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/useData";
import { useProfit } from "@/hooks/useProfit";
import ItemCard from "../items/ItemCard";
import { Backpack, PencilRuler, Coins } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputItem, buildInputItemsMap } from "@/utils/recipes/recipeUtils";

type RecipeItemProps = {
	recipe: Recipe;
	className?: string;
};

export function RecipeItem({ recipe, className }: RecipeItemProps) {
	const { getItemById } = useItems();
	const profit = useProfit(recipe) as number;

	const output = recipe.io.find((item) => item.role === "output");
	if (!output) return null;
	const outputItem = getItemById(output.itemId);

	const outputCount = output.qty;

	if (!outputItem) return null;

	const inputs: RecipeItemBase[] = recipe.io.filter((item) => item.role === "input");

	const inputItems: Record<string, InputItem> = buildInputItemsMap(recipe, getItemById);

	return (
		<div
			key={recipe.id}
			className={cn(
				"flex flex-col sm:flex-row justify-between gap-2 p-2 w-full border shadow rounded-lg",
				className
			)}
		>
			<div className="flex flex-col justify-between gap-1 sm:w-1/2">
				<ItemCard
					item={outputItem}
					count={outputCount.toString()}
					size="lg"
					className="border-transparent shadow-none"
				/>
				<RecipeButtons recipe={recipe} netValue={profit} />
			</div>
			<div className="flex flex-col gap-2 sm:w-1/2 bg-background rounded-lg p-2 sm:min-h-full inset-shadow-sm/20">
				<p className="text-muted-foreground text-center">Ingredients</p>
				{inputs.map((input) => {
					const inputItem = inputItems[input.itemId];
					if (!inputItem) return null;

					return (
						<ItemCard
							key={input.itemId}
							item={inputItem}
							count={input.qty.toString()}
							variant="icon"
							orientation="horizontal"
							size="sm"
						/>
					);
				})}
			</div>
		</div>
	);
}

function RecipeButtons({ recipe, netValue }: { recipe: Recipe; netValue: number }) {
	const requiresBlueprint = recipe.isBlueprintLocked;
	const inRaid = recipe.inRaid;

	return (
		<div className="flex gap-2 w-full p-1">
			{requiresBlueprint && (
				<Popover>
					<PopoverTrigger>
						<div className="p-2 border rounded-sm bg-blue-700/10 dark:bg-blue-300/10 border-blue-700/20 dark:border-blue-300/20 text-blue-700 dark:text-blue-300 cursor-pointer">
							<PencilRuler size={20} />
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<p>Blueprint Required To Craft</p>
					</PopoverContent>
				</Popover>
			)}
			{inRaid && (
				<Popover>
					<PopoverTrigger>
						<div className="p-2 border rounded-sm bg-orange-700/10 dark:bg-orange-300/10 border-orange-700/20 dark:border-orange-300/20 text-orange-700 dark:text-orange-300 cursor-pointer">
							<Backpack size={20} />
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<p>Recipe Available In Raid</p>
					</PopoverContent>
				</Popover>
			)}
			{netValue > 0 && (
				<Popover>
					<PopoverTrigger>
						<div className="p-2 border rounded-sm bg-green-700/10 dark:bg-green-300/10 border-green-700/20 dark:border-green-300/20 text-green-700 dark:text-green-300 cursor-pointer">
							<Coins size={20} />
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<p>Profitable Craft, Net Value: {netValue}</p>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
