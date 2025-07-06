import { getAggregateCounts } from "@/db/queries/getAggregate";
import { AggregateCards } from "./aggregateCards";

export async function AggregateCardsWithData() {
	const { itemCount, questCount, weaponCount, workbenchUpgradeCount } =
		await getAggregateCounts();

	return (
		<AggregateCards
			itemCount={itemCount}
			questCount={questCount}
			weaponCount={weaponCount}
			workbenchUpgradeCount={workbenchUpgradeCount}
		/>
	);
}
