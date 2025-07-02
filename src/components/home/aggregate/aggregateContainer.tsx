import { getAggregateCounts } from "@/db/queries/getAggregate";
import { AggregateCards } from "./aggregateCards";

export async function AggregateCardsWithData() {
	const { itemCount, craftingRecipeCount, questCount, weaponCount, workbenchUpgradeCount } =
		await getAggregateCounts();

	return (
		<AggregateCards
			itemCount={itemCount}
			craftingRecipeCount={craftingRecipeCount}
			questCount={questCount}
			weaponCount={weaponCount}
			workbenchUpgradeCount={workbenchUpgradeCount}
		/>
	);
}
