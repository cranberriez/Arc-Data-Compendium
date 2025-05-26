import { CardContent } from "@/components/ui/card";
import { WorkbenchTier } from "@/types/items/workbench";
import { Item } from "@/types";
import { ItemCard } from "@/components/items/itemDisplay";
import { Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";

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
	const isMobile = useIsMobile();

	return (
		<CardContent className="pt-0 px-2 flex justify-start h-full">
			{tier.requiredItems.length > 0 ? (
				<div className="flex gap-2">
					{tier.requiredItems.map((item) => {
						const itemData = getItemById(item.itemId);
						if (!itemData) {
							return (
								<ItemIconSkeleton
									key={item.itemId}
									size={isMobile ? "sm" : "default"}
								/>
							);
						}
						return (
							<ItemCard
								key={item.itemId}
								variant="icon"
								item={itemData}
								count={item.count}
								size={isMobile ? "sm" : "default"}
								onClick={() => {
									openDialog("item", itemData);
								}}
							/>
						);
					})}
				</div>
			) : (
				<div className="flex items-center justify-center w-full h-full">
					{startsUnlocked ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Unlock
										size={16}
										className={cn("text-green-500 cursor-help")}
									/>
								</TooltipTrigger>
								<TooltipContent side="right">
									<p>Starts Unlocked</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<p>No Item Requirements</p>
					)}
				</div>
			)}
		</CardContent>
	);
}
