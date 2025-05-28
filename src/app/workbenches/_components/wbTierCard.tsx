import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Workbench, WorkbenchTier } from "@/types";
import { useItems } from "@/contexts/itemContext";
import { useDialog } from "@/contexts/dialogContext";
import { WorkbenchTierContent } from "./wbTierContent";

interface WorkbenchTierContainerProps {
	workbench: Workbench;
}

export function WorkbenchTierContainer({ workbench }: WorkbenchTierContainerProps) {
	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-4">
				<h3 className="text-xl font-semibold">Tiers & Requirements</h3>
				<div className="flex flex-wrap gap-2">
					{workbench.tiers.map((tier) => {
						return (
							<WorkbenchTierCard
								key={tier.tier}
								tier={tier}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

interface WorkbenchTierProps {
	tier: WorkbenchTier;
}

export function WorkbenchTierCard({ tier }: WorkbenchTierProps) {
	const { getItemById } = useItems();
	const { openDialog } = useDialog();
	const startsUnlocked = tier.raidsRequired === undefined && tier.requiredItems.length === 0;

	const toRomanNumberal = (num: number) => {
		const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

		return romanNumerals[num - 1];
	};

	return (
		<Card
			key={tier.tier}
			className={cn(
				"flex-1 w-fit px-2 gap-1 min-h-[178px] min-w-[320px] rounded-sm ",
				startsUnlocked && "bg-green-300/10 border-green-300/20 min-w-[100px]"
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

			<WorkbenchTierContent
				key={tier.tier}
				tier={tier}
				getItemById={getItemById}
				openDialog={openDialog}
				startsUnlocked={startsUnlocked}
			/>
		</Card>
	);
}
