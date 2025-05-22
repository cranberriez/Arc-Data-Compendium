import { Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { WorkbenchTier } from "@/types/items/workbench";
import { Item } from "@/types";
import { ItemCard } from "../items/itemDisplay";
import WorkbenchRequirement from "./workbenchRequirement";

interface WorkbenchTierItemProps {
	tier: WorkbenchTier;
	getItemById: (id: string) => Item | undefined;
	openDialog: (type: string, item: Item) => void;
}

export default function WorkbenchTierItem({
	tier,
	getItemById,
	openDialog,
}: WorkbenchTierItemProps) {
	const startsUnlocked = tier.raidsRequired === undefined && tier.requiredItems.length === 0;

	const toRomanNumberal = (num: number) => {
		const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

		return romanNumerals[num - 1];
	};

	return (
		<Card
			key={tier.tier}
			className={cn(
				"w-fit px-2 gap-1 min-h-[178px] rounded-sm ",
				startsUnlocked && "bg-green-300/10 border-green-300/20"
			)}
		>
			<CardHeader className="px-4 [container-type:normal]">
				<div className="flex items-center justify-between w-full min-w-fit gap-3">
					<CardTitle className="text-xl font-mono font-light">
						{toRomanNumberal(tier.tier)}
					</CardTitle>
					{tier.raidsRequired !== undefined && (
						<span className="text-sm dark:text-orange-500 text-orange-700 rounded">
							{tier.raidsRequired} Raid
							{tier.raidsRequired !== 1 ? "s" : ""}
						</span>
					)}
				</div>
			</CardHeader>

			<WorkbenchRequirement
				key={tier.tier}
				tier={tier}
				getItemById={getItemById}
				openDialog={openDialog}
				startsUnlocked={startsUnlocked}
			/>
		</Card>
	);
}
