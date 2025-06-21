import { Recipe, RecipeItemBase, RecipeLockBase } from "@/types";
import { useDialog } from "@/contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { cn } from "@/lib/utils";
import getItemIcon from "@/components/items/getItemIcon";
import { formatName, getRarityColor } from "@/data/items/itemUtils";
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
	const locks = recipe.locks;

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
			{locks && (
				<div className="flex flex-col items-center gap-2">
					<div className="flex items-center gap-2 text-red-600 dark:text-red-400">
						<Lock size={14} />
						<span className="mb-[2px]">Unlock Requirements:</span>
					</div>
					<RecipeUnlockType recipeLocks={locks} />
				</div>
			)}
		</div>
	);
}

function RecipeUnlockType({ recipeLocks }: { recipeLocks: RecipeLockBase | undefined }) {
	if (!recipeLocks) return null;

	const lockTypeDetails = (lockType: string) => {
		const iconClasses = (color: string) => `w-4 h-4 text-${color}`;
		const icons: Record<string, { Icon: React.ElementType; color: string }> = {
			looted: { Icon: Box, color: "gray-600/80" },
			mastery: { Icon: Crown, color: "green-500/80" },
			quest: { Icon: BookMarked, color: "yellow-500/80" },
			battlepass: { Icon: TicketCheck, color: "blue-500/80" },
			skill: { Icon: Hexagon, color: "purple-500/80" },
			event: { Icon: Timer, color: "orange-500/80" },
		};

		const { Icon, color } = icons[lockType] || { Icon: CircleHelp, color: "gray-700/80" };

		return {
			icon: (
				<Icon
					size={14}
					className={iconClasses(color)}
				/>
			),
		};
	};

	const lockPill = (key: string, value: string | boolean) => {
		const lockVisuals = lockTypeDetails(key);
		let displayKey: string;
		let displayValue: string;

		// TODO: Make this look nicer, some values don't quite work with the current schema
		if (typeof value === "boolean") {
			displayKey = key;
			displayValue = value ? "" : "";
		} else {
			displayKey = value === "Mastery" || value === "Other" ? "" : value;
			displayValue = key;
		}

		return (
			<div
				className={cn("flex items-center gap-2")}
				key={key}
			>
				{lockVisuals.icon}
				<p className="mb-[2px]">
					{formatName(displayKey)} {formatName(displayValue)}
				</p>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{Object.entries(recipeLocks).map(([key, value]) => {
				if (!value) return null;
				if (key === "recipeId") return null;

				return lockPill(key, value);
			})}
		</div>
	);
}
