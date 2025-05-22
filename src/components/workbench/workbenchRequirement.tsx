import { CardContent } from "../ui/card";
import { WorkbenchTier } from "@/types/items/workbench";
import { Item } from "@/types";
import { ItemCard } from "../items/itemDisplay";
import { Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkbenchRequirementProps {
	tier: WorkbenchTier;
	getItemById: (id: string) => Item | undefined;
	openDialog: (type: string, item: Item) => void;
	startsUnlocked: boolean;
}

export default function WorkbenchRequirement({
	tier,
	getItemById,
	openDialog,
	startsUnlocked,
}: WorkbenchRequirementProps) {
	return (
		<CardContent className="pt-0 px-2 flex justify-center h-full">
			{tier.requiredItems.length > 0 ? (
				<div className="flex gap-2">
					{tier.requiredItems.map((item) => {
						const itemData = getItemById(item.itemId);
						if (!itemData) {
							return (
								<div
									key={item.itemId}
									className="flex flex-col h-[90px] aspect-square items-center gap-1 p-2 border-2 border-red-500 rounded-md bg-muted/50 cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<div className="w-8 h-8 bg-red-500/30 border-red-500 border-2 rounded" />
										<span className="text-lg font-mono text-center">
											x{item.count}
										</span>
									</div>
									<span className="text-xs text-muted-foreground truncate w-full text-center">
										{item.itemId}
									</span>
								</div>
							);
						}
						return (
							<ItemCard
								key={item.itemId}
								variant="icon"
								item={itemData}
								count={item.count}
								onClick={() => {
									openDialog("item", itemData);
								}}
							/>
						);
					})}
				</div>
			) : (
				<div className="flex items-center justify-center h-full">
					<Unlock
						size={16}
						className={cn(startsUnlocked && "text-green-500")}
					/>
				</div>
			)}
		</CardContent>
	);
}
