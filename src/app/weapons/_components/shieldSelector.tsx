import { SHIELD_VALUES } from "@/utils/weapons/shieldValues";
import { cn } from "@/lib/utils";
import { formatName } from "@/utils/format";

export function TTKShieldSelector({
	shield,
	setShield,
}: {
	shield: string;
	setShield: (shield: string) => void;
}) {
	const shieldButton = (shield: string, isCurrent: boolean) => {
		const shieldData = SHIELD_VALUES[shield];

		return (
			<div
				className={cn(
					"px-2 py-1 flex items-center gap-1 cursor-pointer transition-all",
					isCurrent && "dark:bg-primary/20 bg-primary/10 rounded-sm"
				)}
				onClick={() => setShield(shield)}
			>
				<div className={cn("w-2 h-2 rounded-[2px] mb-[2px]", shieldData.color)} />
				<span className="mb-1 text-sm">{formatName(shield)}</span>
			</div>
		);
	};

	return (
		<div className="w-full flex justify-between bg-card border-1 p-1 rounded-lg">
			{shieldButton("none", shield === "none")}
			{shieldButton("light", shield === "light")}
			{shieldButton("medium", shield === "medium")}
			{shieldButton("heavy", shield === "heavy")}
		</div>
	);
}
