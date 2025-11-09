import { Recipe, RecipeItemBase } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { cn } from "@/lib/utils";
import getItemIcon from "@/components/items/getItemIcon";
import { formatName, getRarityColor } from "@/utils/items/itemUtils";
import {
	BookMarked,
	Box,
	CircleHelp,
	Crown,
	Hexagon,
	Lock,
	TicketCheck,
	Timer,
} from "lucide-react";

export function RecipeItem({ recipe, className }: { recipe: Recipe; className?: string }) {
	const { getItemById } = useItems();
	const { openDialog } = useDialog();

	const output = recipe.io.find((item) => item.role === "output");
	if (!output) return null;

	const outputCount = output.qty;
	const outputItem = getItemById(output.itemId);

	if (!outputItem) return null;

	const inputs: RecipeItemBase[] = recipe.io.filter((item) => item.role === "input");

	return (
		<div
			key={recipe.id}
			className={cn(
				"flex flex-wrap justify-between items-center gap-2 p-2 w-full",
				className
			)}
		>
			<div className="flex flex-wrap flex-1 items-center gap-2">
				<div
					className="flex items-center gap-2 rounded-md hover:bg-primary/10 cursor-pointer w-sm"
					onClick={() => {
						openDialog("item", outputItem);
					}}
				>
					{getItemIcon(
						outputItem.icon,
						`w-12 h-12 p-2 rounded-md text-card ${getRarityColor(
							outputItem.rarity,
							"bg"
						)}`
					)}
					{outputCount > 1 && <p className="text-3xl font-mono">{outputCount}</p>}
					<p className="mb-[2px] text-xl">{outputItem.name}</p>
				</div>
				<div className="flex flex-col gap-2 text-md">
					{inputs.length === 0 ? (
						<div className="flex items-center gap-2 text-muted-foreground">
							<p className="mb-[2px] font-bold font-mono">Unknown Requirements</p>
						</div>
					) : (
						inputs.map((input) => {
							const reqItem = getItemById(input.itemId);
							if (!reqItem) return null;

							return (
								<div
									key={input.itemId}
									className="flex items-center gap-2 text-lg dark:text-muted-foreground hover:text-primary cursor-pointer"
									onClick={() => {
										openDialog("item", reqItem);
									}}
								>
									{getItemIcon(
										reqItem.icon,
										`w-6 h-6 ${getRarityColor(reqItem.rarity, "text")}`
									)}
									<p className="mb-[3px] font-bold font-mono">{input.qty}</p>
									<p className="mb-[3px]">{reqItem.name}</p>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
