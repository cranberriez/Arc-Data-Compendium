import { getAggregateCounts } from "@/db/queries/getAggregate";
import {
	HeaderCard,
	AggregateCards,
	QuickLinks,
	WishlistNow,
	FAQ,
	Credits,
	HomeFooter,
} from "@/components/home";

export const metadata = {
	title: "ARCVault - ARC Raiders Companion & Data Vault",
	description:
		"Your ultimate resource for ARC Raiders with detailed item stats, recycle chains, quests, tracking, and more. Browse every item in the game and find out how to get it, what it's for, and how to use it. Track your progress and plan your next raid with ease. Create item checklists and see every item you will ahead of time in one place.",
	keywords: [
		"ARC Raiders vault",
		"ARC Raiders items",
		"ARC Raiders database",
		"ARC Raiders crafting guide",
		"weapon stats ARC Raiders",
		"shield stats ARC Raiders",
		"recycle",
		"workbenches",
	],
};

export default async function Page() {
	const { itemCount, craftingRecipeCount, questCount, weaponCount, workbenchUpgradeCount } =
		await getAggregateCounts();

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<HeaderCard />
				<AggregateCards
					itemCount={itemCount}
					craftingRecipeCount={craftingRecipeCount}
					questCount={questCount}
					weaponCount={weaponCount}
					workbenchUpgradeCount={workbenchUpgradeCount}
				/>
				<QuickLinks />
				<WishlistNow />
				<FAQ />
				<Credits />
				<HomeFooter />
			</div>
		</article>
	);
}
