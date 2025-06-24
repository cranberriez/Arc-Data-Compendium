import { ExternalLink, Wrench } from "lucide-react";
import Link from "next/link";

export function QuickLinks() {
	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
			<h2 className="sr-only">Quick Links</h2>
			<ExternalSiteLinks />
			<InternalSiteLinks />
		</div>
	);
}

function ExternalSiteLinks() {
	return (
		<div className="flex flex-col gap-2 bg-card rounded-lg p-6">
			<h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-4">
				<ExternalLink className="w-6 h-6 text-arc-green-600 dark:text-arc-green-400" />
				Useful Sites
			</h3>
			<div className="flex flex-col gap-6">
				<ExternalSiteItem
					name="ARC Raiders Official Wikipedia"
					link="https://arcraiders.wiki"
					description="The official wiki for Arc Raiders, community driven, and updated frequently."
				/>
				<ExternalSiteItem
					name="ARC Raiders Build"
					link="https://arcraiders.build"
					description="A community-driven build site for Arc Raiders with useful guides and more."
				/>
				<ExternalSiteItem
					name="ARC Tracker"
					link="https://arctracker.io/"
					description="A personal companion for tracking progress, items, and hideout upgrades."
				/>
				<ExternalSiteItem
					name="ARC Raiders Companion App"
					link="https://arcraiders.app/"
					description="A toolkit for interactive maps, loadout planning, item tracking, quest tracking, skills, and more."
				/>
			</div>
		</div>
	);
}

function ExternalSiteItem({
	name,
	link,
	description,
}: {
	name: string;
	link: string;
	description: string;
}) {
	return (
		<Link
			href={link}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="flex flex-col gap-2 p-2 rounded-sm border-2 border-transparent hover:border-muted-foreground/20 hover:bg-muted/20 transition-colors">
				<p className="text-foreground flex items-center gap-2">
					{name}
					<ExternalLink className="w-4 h-4 text-muted-foreground" />
				</p>
				<p className="text-muted-foreground">{description}</p>
			</div>
		</Link>
	);
}

function InternalSiteLinks() {
	return (
		<div className="flex flex-col gap-2 bg-card rounded-lg p-6">
			<h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-4">
				<Wrench className="w-6 h-6 text-arc-green-600 dark:text-arc-green-400" />
				Tools
			</h3>
		</div>
	);
}
