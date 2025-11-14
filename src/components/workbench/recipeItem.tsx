import { Item, Recipe, RecipeItemBase } from "@/types";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/useData";
import ItemCard from "../items/ItemCard";
import { Backpack, PencilRuler, Coins } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type RecipeItemProps = {
	recipe: Recipe;
	className?: string;
};

type InputItem = Item & {
	qty: number;
};

export function RecipeItem({ recipe, className }: RecipeItemProps) {
	const { getItemById } = useItems();

	const output = recipe.io.find((item) => item.role === "output");
	if (!output) return null;

	const outputCount = output.qty;
	const outputItem = getItemById(output.itemId);

	if (!outputItem) return null;

	const inputs: RecipeItemBase[] = recipe.io.filter((item) => item.role === "input");

	const inputItems: Record<string, InputItem> = inputs.reduce((acc, item) => {
		const inputItem = getItemById(item.itemId);
		if (!inputItem) return acc;
		acc[inputItem.id] = { ...inputItem, qty: item.qty };
		return acc;
	}, {} as Record<string, InputItem>);

	const inputValue = inputValueCalculator(Object.values(inputItems));
	const outputValue = outputItem.value * outputCount;

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
				<RecipeButtons recipe={recipe} netValue={outputValue - inputValue} />
			</div>
			<div className="flex flex-col gap-2 sm:w-1/2 bg-background rounded-lg p-2 sm:min-h-full">
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
						<div className="p-2 border rounded-sm bg-blue-300/10 border-blue-300/20 text-blue-300 cursor-pointer">
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
						<div className="p-2 border rounded-sm bg-orange-300/10 border-orange-300/20 text-orange-300 cursor-pointer">
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
						<div className="p-2 border rounded-sm bg-green-300/10 border-green-300/20 text-green-300 cursor-pointer">
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

const inputValueCalculator = (inputs: InputItem[]) => {
	const totalValue = inputs.reduce((acc, input) => {
		return acc + input.qty * input.value;
	}, 0);
	return totalValue;
};
