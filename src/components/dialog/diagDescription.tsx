import { DialogDescription } from "@/components/ui/dialog";
import { Item } from "@/types";
import { Coins, Weight } from "lucide-react";

export default function DiagDescription({ item }: { item: Item }) {
	return (
		<>
			<DialogDescription>
				<span className="sr-only">
					Details for {item.name}, {item.rarity} {item.category}
					{item.recipeId ? ", Recipe" : ""}
				</span>

				{item.description}
			</DialogDescription>

			<div className="flex w-full items-center gap-4 text-sm text-muted-foreground">
				<span className="flex items-center gap-1">
					<Weight className="w-4 h-4" /> {item.weight}kg
				</span>
				<span className="flex items-center gap-1">
					<Coins className="w-4 h-4" /> {item.value} Sell Value
				</span>
			</div>
		</>
	);
}
