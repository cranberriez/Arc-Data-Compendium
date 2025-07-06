import { StatsContainer } from "./statsContainer";
import { Weapon } from "@/types";

export function StatsPanel({ visible, weapon }: { visible: boolean; weapon: Weapon | null }) {
	if (!visible) return null;
	return (
		<div className="flex flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
			<StatsContainer weapon={weapon} />
		</div>
	);
}
