"use client";

import { useWorkshop } from "@/contexts/workshopContext";

export default function ItemChecklist() {
	const { getWorkbenchUpgradeSummary } = useWorkshop();
	const summary = getWorkbenchUpgradeSummary();
	return (
		<div>
			<h1>Item Checklist</h1>
			<div className="flex flex-row gap-2">
				{Object.entries(summary).map(([itemId, itemSummary]) => {
					return <p>{itemId}</p>;
				})}
			</div>
		</div>
	);
}
