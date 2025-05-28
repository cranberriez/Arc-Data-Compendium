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
				disabled={!canUpgrade}
				className="flex-1 bg-blue-600 hover:bg-blue-700"
				onClick={onUpgrade}
			>
				<Plus className="mr-2 h-4 w-4" />
				{canUpgrade ? `Upgrade to Tier ${currentTier + 1}` : "Max Tier Reached"}
			</Button>
			<Button
				variant="outline"
				disabled={!canDowngrade}
				onClick={onDowngrade}
			>
				<Minus className="mr-2 h-4 w-4" />
				Downgrade
			</Button>
		</div>
	);
}
