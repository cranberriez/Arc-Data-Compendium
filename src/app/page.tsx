"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Info, Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<article className="w-full p-4">
			<HeaderCard />
		</article>
	);
}

function HeaderCard() {
	return (
		<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
			<div className="w-full flex flex-col items-start justify-center gap-6 p-4 lg:p-8 rounded-xl bg-gradient-to-r from-arc-green-400/20 to-transparent bg-[length:200%_100%] bg-[position:0_0]">
				<h1 className="text-6xl font-bold">ARC Vault</h1>
				<h2 className="text-lg lg:text-xl tracking-tight text-foreground/80 max-w-2xl">
					The ultimate data compendium and tracker for ARC Raiders. Explore items,
					weapons, armor, quests, recipes, and more.
				</h2>
				<div className="flex flex-wrap gap-2 ">
					<Button
						size="lg"
						className="p-3 px-6 h-auto w-auto font-semibold text-black hover:text-black bg-arc-green-500 hover:bg-arc-green-300"
						asChild
					>
						<Link href="/items">
							<Search className="w-4 h-4" />
							Explore Items
						</Link>
					</Button>
					<Button
						size="lg"
						className="border-2 border-arc-green-500 bg-background text-arc-green-900 dark:text-arc-green-500 hover:text-black hover:border-arc-green-300 hover:bg-arc-green-300 p-3 px-6 h-auto w-auto font-semibold "
						asChild
					>
						<Link href="/about">
							<Info className="w-4 h-4" />
							About
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

function oldHomepage() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0 w-full h-full">
			<div className="w-full max-w-2xl rounded-lg border border-dashed border-muted-foreground/30 p-6 bg-muted/20">
				<div className="space-y-4">
					<div className="text-center space-y-2">
						<h2 className="text-xl font-semibold tracking-tight text-foreground">
							Coming Soon
						</h2>
						<p className="text-muted-foreground">
							This page is still a work in progress. Here&apos;s what we&apos;re
							planning:
						</p>
					</div>
					<ul className="grid gap-2 text-sm text-muted-foreground list-disc list-inside marker:text-muted-foreground/50">
						<li className="pl-2 font-medium text-foreground/90">
							<span className="font-semibold text-foreground">
								Description Item Details
							</span>{" "}
							- Item found in area, flavor text, stats, and more in the final version
						</li>
						<li className="pl-2 font-medium text-foreground/90">
							<span className="font-semibold text-foreground">
								Quick Access Favorites
							</span>{" "}
							- Save and organize your most-used items
						</li>
						<li className="pl-2 font-medium text-foreground/90">
							<span className="font-semibold text-foreground">
								Smart Search Zones
							</span>{" "}
							- Find where to get your favorited items
						</li>
						<li className="pl-2 font-medium text-foreground/90">
							<span className="font-semibold">Workbench Tracker</span> - Monitor your
							upgrade progress
						</li>
						<li className="pl-2 font-medium text-foreground/90">
							<span className="font-semibold">Recipe Manager</span> - Track your
							crafting progress
						</li>
						<li className="pl-2 text-muted-foreground/70 text-sm">
							(World events and more might come later&#8230;)
						</li>
					</ul>
				</div>

				<div className="mt-8 w-full pb-2">
					<h3 className="text-lg font-semibold mb-4 text-foreground">
						Frequently Asked Questions
					</h3>
					<Accordion
						type="single"
						collapsible
						className="w-full space-y-3"
					>
						<AccordionItem
							value="sources"
							className="border rounded-lg px-4"
						>
							<AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
								Where do you source your item information from?
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground pb-2">
								A user by the name of Redstone_Gamer_1 has provided an excellent
								list of information found
								<Link
									href="https://docs.google.com/document/d/1LPpXIYuTH54o3bWDx3Q7ClRDGLGNpIuNvisK-HwOwjk/edit?usp=sharing"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary inline-flex items-center gap-1 hover:underline"
								>
									here <ExternalLink className="w-3 h-3" />
								</Link>
								. Information not provided here was acquired from various YouTube
								videos. This is the case for all information provided until the game
								releases.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="official"
							className="border rounded-lg px-4"
						>
							<AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
								Is the site official whatsoever?
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground pb-2">
								No, this is a fan project.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="corrections"
							className="border rounded-lg px-4"
						>
							<AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
								I&apos;ve found an item to be incorrect or missing, what do I do?
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground pb-2">
								Fill out the provided form (coming soon) or contact us on our
								discord (coming soon)
								{/* <Link
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary inline-flex items-center gap-1 hover:underline ml-1"
								>
									Discord <ExternalLink className="w-3 h-3" />
								</Link> */}
								.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="creator"
							className="border last:border-b-1 rounded-lg px-4 overflow-visible"
						>
							<AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
								Who made this site?
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground pb-2">
								Me, I made it.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="space-y-4 mt-8">
					{/* Add smaller acknowledgments here */}
					<div className="space-y-1.5">
						<h3 className="text-lg font-semibold mb-4 text-foreground">
							Acknowledgments
						</h3>
						<div className="flex flex-col gap-4">
							{contributors.map((contributor) => (
								<Contributor
									key={contributor.name}
									{...contributor}
								/>
							))}
						</div>
					</div>
					<p className="text-sm dark:text-red-400/50 text-red-800">
						Nothing on this site is final. This is a work in progress and is subject to
						change at any time. Almost every item is incomplete or contains incorrect
						information.
					</p>
					<div className="flex items-center text-xs text-muted-foreground">
						<div className="relative w-4 h-4 mr-1">
							<Heart
								className="w-full h-full text-red-500"
								fill="currentColor"
							/>
							<Heart
								className="w-full h-full text-red-500 absolute top-0 left-0 animate-ping"
								fill="currentColor"
							/>
						</div>
						Special thanks to our direct & indirect contributors.
					</div>
				</div>
			</div>
		</div>
	);
}

const contributors = [
	{
		name: "Redstone_Gamer_1",
		links: [
			{
				site: "https://docs.google.com/document/d/1LPpXIYuTH54o3bWDx3Q7ClRDGLGNpIuNvisK-HwOwjk/edit?usp=sharing",
				name: "Google Doc",
			},
		],
		role: "Item & Recipe Documentation, Inspiration",
	},
	{
		name: "Zeetu",
		links: [
			{
				site: "https://arctracker.io/",
				name: "ArcTracker",
			},
			{
				site: "https://github.com/RaidTheory/arcraiders-data",
				name: "ARC Data Project",
			},
			{
				site: "https://discord.gg/3EdnvjtcGW",
				name: "Discord",
			},
		],
		role: "Game Documentation & Item Images",
	},
	{
		name: "nateblaine",
		links: [
			{
				site: "https://github.com/nateblaine/scrappy-tr-api",
				name: "Scrappy API",
			},
		],
		role: "Item Data",
	},
	{
		name: "Z, S, G",
		links: [],
		role: "UI/UX Design Considerations",
	},
];

const Contributor = ({
	name,
	links,
	role,
}: {
	name: string;
	links: { site: string; name: string }[];
	role: string;
}) => {
	return (
		<div className="flex sm:flex-row flex-col sm:items-center gap-4 w-full text-sm">
			<div className="sm:w-1/4 w-full sm:text-right h-full sm:justify-end text-muted-foreground">
				<span className="font-semibold text-base">{name}</span>
			</div>
			<div className="flex flex-col gap-1 border-l border-muted-foreground/20 pl-4">
				<span className="text-muted-foreground/80">{role}</span>
				<div className="flex gap-3">
					{links.map((link) => (
						<Link
							key={link.name}
							href={link.site}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary inline-flex items-center gap-1 hover:underline"
						>
							{link.name} <ExternalLink className="w-3 h-3" />
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};
