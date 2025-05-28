import { Workbench } from "@/types/items/workbench";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WorkbenchTierContainer } from "./wbTierCard";

interface WorkbenchDisplayProps {
	workbench: Workbench;
	children: React.ReactNode;
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

export function WorkbenchDisplay({ workbench, children }: WorkbenchDisplayProps) {
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

			{children}
		</div>
	);
}
