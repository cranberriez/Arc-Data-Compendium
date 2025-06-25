import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
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
