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
				Most of the information comes from the ARC Raiders wikipedia. This site is mainly an
				aggregation of the data provided there. Some information is pulled from the game by
				me, or provided by members of the community.
			</p>
		),
	},
	{
		question: "Is the data up to date and accurate?",
		answer: (
			<p className="leading-loose">
				As of 11/9/2025, the data present is as accurate as possible. I will do my best to
				update information as the game is updated. If you find anything wrong with the site
				please contact me on our{" "}
				<a
					href="https://discord.gg/uZfNEsrn5s"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary inline-flex items-center gap-1 underline"
				>
					Discord
				</a>{" "}
				or send an email to{" "}
				<a
					href="mailto:official.arcvault@gmail.com"
					className="text-primary inline-flex items-center gap-1 underline"
				>
					official.arcvault@gmail.com
				</a>
				.
			</p>
		),
	},
	{
		question: "I've found an item to be incorrect or missing, what do I do?",
		answer: (
			<p className="leading-loose">
				Contact us on our{" "}
				<a
					href="https://discord.gg/uZfNEsrn5s"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary inline-flex items-center gap-1 underline"
				>
					discord
				</a>
				.
			</p>
		),
	},
	{
		question: "Who made this site?",
		answer: (
			<p className="leading-loose">
				This site is a solo passion project by{" "}
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
				<MessageCircleQuestion className="w-6 h-6 text-arcvault-primary-600 dark:text-arcvault-primary-400" />
				Frequently Asked Questions
			</h3>
			<Accordion type="single" collapsible className="w-full flex flex-col gap-4">
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
