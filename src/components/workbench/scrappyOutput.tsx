export function ScrappyOutput({ currentTier }: { currentTier: number }) {
	type MaterialReward = {
		common: number;
		uncommon: number;
	};

	type RaidOutcome = {
		success: MaterialReward;
		failure: MaterialReward;
	};

	type ScrappyRaidRewardsByLevel = {
		[level: number]: RaidOutcome;
	};

	// List of common material names (placeholders, replace with real names if available)
	const commonMaterials = ["Metal Parts", "Fabric", "Plastic Parts", "Chemicals", "Rubber"];

	// Uncommon material note
	const uncommonNote = "(random topside material)";

	const scrappyRaidRewards: ScrappyRaidRewardsByLevel = {
		1: {
			success: { common: 12, uncommon: 2 },
			failure: { common: 5, uncommon: 1 },
		},
		2: {
			success: { common: 13, uncommon: 4 },
			failure: { common: 6, uncommon: 2 },
		},
	};

	// Determine which tier's data to use
	const rewards = scrappyRaidRewards[currentTier];

	if (!rewards) {
		return <div>No data available for this tier.</div>;
	}

	return <div>Scrappy output is currently unknown.</div>;

	return (
		<div className="space-y-4 flex flex-wrap gap-8">
			<div>
				<h4 className="font-semibold">On Success:</h4>
				<div className="flex items-center gap-2 mb-2">
					<span className="font-medium">{rewards.success.common}x each of:</span>
					<div className="flex flex-wrap gap-2">
						{commonMaterials.map((mat) => (
							<span key={mat} className="inline-block px-2 py-1 bg-muted rounded">
								{mat}
							</span>
						))}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-medium">
						{rewards.success.uncommon}x uncommon material
					</span>
					<span className="italic">{uncommonNote}</span>
				</div>
			</div>
			<div>
				<h4 className="font-semibold">On Failure:</h4>
				<div className="flex items-center gap-2 mb-2">
					<span className="font-medium">{rewards.failure.common}x each of:</span>
					<div className="flex flex-wrap gap-2">
						{commonMaterials.map((mat) => (
							<span key={mat} className="inline-block px-2 py-1 bg-muted rounded">
								{mat}
							</span>
						))}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-medium">
						{rewards.failure.uncommon}x uncommon material
					</span>
					<span className="italic">{uncommonNote}</span>
				</div>
			</div>
		</div>
	);
}
