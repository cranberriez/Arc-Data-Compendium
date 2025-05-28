import { Workbench } from "@/types/items/workbench";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WorkbenchTierCard } from "./wbTierCard";

interface WorkbenchDisplayProps {
	workbench: Workbench;
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
			Locked
		</Badge>
	);
};

export function WorkbenchDisplay({ workbench }: WorkbenchDisplayProps) {
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
		</div>
	);
}
