import { DialogDescription } from "@/components/ui/dialog";
import { Coins, Weight } from "lucide-react";

export default function DiagDescription({
	name,
	rarity,
	category,
	recipeId,
	itemDescription,
	weight,
	sellValue,
}: {
	name: string;
	rarity: string;
	category: string;
	recipeId: string | null;
	itemDescription: string | null;
	weight: number;
	sellValue: number;
}) {
	return (
		<>
			<DialogDescription className="max-w-[400px]">
				<span className="sr-only">
					Details for {name}, {rarity} {category}
					{recipeId ? ", Recipe" : ""}
				</span>

				{itemDescription ? itemDescription : "No description available."}
			</DialogDescription>

			<div className="flex w-full items-center gap-4 text-sm text-muted-foreground">
				<span className="flex items-center gap-1">
					<Weight className="w-4 h-4" /> {weight}kg
				</span>
				<span className="flex items-center gap-1">
					<Coins className="w-4 h-4" /> {sellValue} Sell Value
				</span>
			</div>
		</>
	);
}
