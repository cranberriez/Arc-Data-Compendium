import {
	HeaderCard,
	QuickLinks,
	WishlistNow,
	FAQ,
	Credits,
	HomeFooter,
	AggregateCardsWithData,
	AggregateCards,
	AlertBox,
} from "@/components/home";
import { Suspense } from "react";

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

export default function Page() {
	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<HeaderCard />
				<AlertBox />
				<Suspense fallback={<AggregateCards />}>
					<AggregateCardsWithData />
				</Suspense>
				<QuickLinks />
				<WishlistNow />
				<FAQ />
				<Credits />
				<HomeFooter />
			</div>
		</article>
	);
}
