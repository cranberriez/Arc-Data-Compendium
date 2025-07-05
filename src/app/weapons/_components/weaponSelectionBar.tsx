import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Weapon } from "@/types";

export function WeaponSelectionBar({
	selectedWeapon,
	showStats,
	setShowStats,
}: {
	selectedWeapon: Weapon | null;
	showStats: boolean;
	setShowStats: (show: boolean) => void;
}) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 sticky top-0 z-99 bg-background transition-all duration-400 ease-in-out",
				selectedWeapon ? "h-16 opacity-100" : "h-0 opacity-0"
			)}
		>
			<p className="font-semibold">Selected Weapon:</p>
			<p className="text-sm text-muted-foreground">{selectedWeapon?.name}</p>
			<Button
				onClick={() => setShowStats(!showStats)}
				disabled={!selectedWeapon}
				variant="default"
				className="ml-auto font-mono"
			>
				{showStats ? "Hide Stats" : "Show Stats"}
			</Button>
		</div>
	);
}
