"use client";

import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeButtonsProps {
	currentTier: number;
	maxTier: number;
	onUpgrade?: () => void;
	onDowngrade?: () => void;
}

export function UpgradeButtons({
	currentTier,
	maxTier,
	onUpgrade,
	onDowngrade,
}: UpgradeButtonsProps) {
	const canUpgrade = currentTier < maxTier;
	const canDowngrade = currentTier > 1;

	return (
		<div className="flex gap-3">
			<Button
				variant="outline"
				disabled={!canDowngrade}
				className="cursor-pointer"
				onClick={onDowngrade}
			>
				<Minus className="mr-2 h-4 w-4" />
				Downgrade
			</Button>
			<Button
				disabled={!canUpgrade}
				className="flex-1 bg-green-300 hover:bg-green-400 dark:bg-green-700 hover:dark:bg-green-600 border-1 text-primary cursor-pointer"
				onClick={onUpgrade}
			>
				<Plus className="mr-2 h-4 w-4" />
				{canUpgrade ? `Upgrade to Tier ${currentTier + 1}` : "Max Tier Reached"}
			</Button>
		</div>
	);
}
