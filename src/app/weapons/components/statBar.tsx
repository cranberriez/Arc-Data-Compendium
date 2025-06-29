import { Progress } from "@/components/ui/progress";
import { STAT_MAX_VALUES } from "@/utils/weapons/shieldValues";

export function StatBar({
	label,
	value,
	maxValue,
}: {
	label: string;
	value: number;
	maxValue?: number;
}) {
	const max = maxValue || STAT_MAX_VALUES[label.toLowerCase().replace(/ /g, "_")] || 100;
	const percentage = (value / max) * 100;
	return (
		<div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-0.5">
			<span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
			<span className="text-sm font-medium justify-self-end tabular-nums">{value}</span>
			<div className="col-span-2">
				<Progress
					value={percentage}
					className="h-2 bg-muted/50"
				/>
			</div>
		</div>
	);
}
