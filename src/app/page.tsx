"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";
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
				<p className="text-sm dark:text-red-400/50 text-red-800">
					Nothing on this site is final. This is a work in progress and is subject to
					change at any time. Almost every item is incomplete or contains incorrect
					information.
				</p>
			</div>
		</div>
	);
}
