import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ExternalLink, MessageCircleQuestion } from "lucide-react";

const faqData = [
	{
		question: "Where do you source your item information from?",
		answer: (
			<p className="leading-loose">
				A user by the name of Redstone_Gamer_1 provided an excellent list of information
				which was the basis for the site. The information was moved to the ARC Raiders wiki
				which is where most of the information is from. Information not provided on the wiki
				was acquired from various YouTube videos, or from personal testing. This is the case
				for all information provided until the game releases.
			</p>
		),
	},
	{
		question: "Is the data up to date and accurate?",
		answer: "The game is not available yet, so the data is updated semi-regularly, but it is not guaranteed to be 100% accurate. When the game fully releases the data will be updated to be as accurate as possible as quickly as possible. We'll do our best to keep it up to date and tag items to show their accuracy.",
	},
	{
		question: "Is the site official?",
		answer: "No, this is a fan project.",
	},
	{
		question: "I've found an item to be incorrect or missing, what do I do?",
		answer: "Fill out the provided form (coming soon) or contact us on our discord (coming soon).",
	},
	{
		question: "Who made this site?",
		answer: (
			<p className="leading-loose">
				This site was developed with love by{" "}
				<Link
					href="https://github.com/cranberriez"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary inline-flex items-center gap-1 underline"
				>
					Jacob
				</Link>
				.
			</p>
		),
	},
];

export function FAQ() {
	return (
		<div className="w-full bg-card p-8 rounded-lg">
			<h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-4">
				<MessageCircleQuestion className="w-6 h-6 text-arc-green-600 dark:text-arc-green-400" />
				Frequently Asked Questions
			</h3>
			<Accordion
				type="single"
				collapsible
				className="w-full flex flex-col gap-4"
			>
				{faqData.map((item) => (
					<AccordionItem
						key={item.question}
						value={item.question}
						className="border rounded-lg px-4 mb-2"
					>
						<AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-2">
							{typeof item.answer === "string" ? (
								<p className="leading-loose">{item.answer}</p>
							) : (
								item.answer
							)}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
