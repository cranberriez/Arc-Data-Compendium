"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";

export default function Page() {
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
					<p className="flex items-center text-xs text-muted-foreground">
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
					</p>
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
		name: "Z, S, G",
		links: [],
		role: "UI/UX Design",
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
