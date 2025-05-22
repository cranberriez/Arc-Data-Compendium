import { Workbench } from "@/types/items/workbench";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Item } from "@/types";
import WorkbenchRequirement from "./workbenchTierItem";

interface WorkbenchDisplayProps {
	workbench: Workbench;
	getItemById: (id: string) => Item | undefined;
	openDialog: (type: string, item: Item) => void;
}

const startsWithBadge = (baseTier: number) => {
	if (baseTier === 1)
		return (
			<Badge
				variant="outline"
				className="text-sm bg-green-300/10 border-green-300/20"
			>
				Unlocked
			</Badge>
		);
	return (
		<Badge
			variant="outline"
			className="text-sm bg-red-400/10 border-red-400/20"
		>
			Starts Locked
		</Badge>
	);
};

export function WorkbenchDisplay({ workbench, getItemById, openDialog }: WorkbenchDisplayProps) {
	return (
		<div>
			<div className="flex flex-col gap-2">
				<h2 className="text-3xl font-bold tracking-tight">{workbench.name}</h2>
				<div className="flex items-center gap-3">
					{startsWithBadge(workbench.baseTier)}
					<Badge
						variant="secondary"
						className="text-sm"
					>
						{workbench.tiers.length} Tier
						{workbench.tiers.length !== 1 ? "s" : ""}
					</Badge>
				</div>
			</div>

			<Separator className="my-4" />

			<div className="grid grid-rows-1 gap-6">
				{/* Left Column - Tiers and Requirements */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">Tiers & Requirements</h3>
					<div className="flex flex-wrap gap-2">
						{workbench.tiers.map((tier) => {
							return (
								<WorkbenchRequirement
									key={tier.tier}
									tier={tier}
									getItemById={getItemById}
									openDialog={openDialog}
								/>
							);
						})}
					</div>
				</div>

				{/* Right Column - Empty for now */}
				{/* <div className="space-y-4">
					<h3 className="text-xl font-semibold">Recipes</h3>
					<Card>
						<CardContent className="pt-6 text-muted-foreground text-center">
							<p>Additional details will be displayed here</p>
						</CardContent>
					</Card>
				</div> */}
			</div>
		</div>
	);
}
