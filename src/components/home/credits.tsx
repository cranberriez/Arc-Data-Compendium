import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";

export function Credits() {
	return (
		<div className="flex flex-col gap-6 w-full p-8 bg-card rounded-lg">
			{/* Add smaller acknowledgments here */}
			<div>
				<h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-4">
					<Heart className="w-6 h-6 text-arcvault-primary-600 dark:text-arcvault-primary-400" />
					Acknowledgments
				</h3>
				<div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
					{contributors.map((contributor) => (
						<Contributor
							key={contributor.name}
							{...contributor}
						/>
					))}
				</div>
			</div>

			<div className="flex items-center text-sm text-muted-foreground">
				<div className="relative w-4 h-4 mr-2">
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
		name: "My Friends",
		links: [],
		role: "Testing, Feedback, & Inspiration",
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
		<div className="flex flex-col flex-1 gap-2 p-4 rounded-lg bg-background">
			<p className="font-semibold text-lg">{name}</p>
			<div className="flex flex-col flex-1 justify-between gap-2 border-l border-muted-foreground/20 pl-4">
				<span className="text-muted-foreground/80">{role}</span>
				<div className="flex flex-wrap gap-3">
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
