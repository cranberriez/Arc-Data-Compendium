import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { tools } from "@/data/tools/tools";

export default function ToolsPage() {
	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<h1 className="text-2xl text-center font-bold">Tools</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tools.map((tool) => (
						<ToolItem
							key={tool.name}
							name={tool.name}
							description={tool.description}
							image={tool.image}
							link={tool.link}
							icon={tool.icon}
							iconColor={tool.iconColor}
						/>
					))}
				</div>
			</div>
		</article>
	);
}

function ToolItem({
	name,
	description,
	image,
	link,
	icon: Icon,
	iconColor,
}: {
	name: string;
	description: string;
	image?: string;
	link: string;
	icon: LucideIcon;
	iconColor: string;
}) {
	const imageUrl = image || "/images/quests/348px-Maps_Together.png-1.webp";

	return (
		<div className="flex flex-col gap-2 rounded-sm border-2">
			<Image
				width={100}
				height={100}
				alt={name}
				className="w-full h-48 object-cover rounded-t"
				unoptimized
				src={imageUrl}
			/>
			<div className="flex items-end justify-between gap-2 p-4 ">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Icon className={iconColor} />
						<h2 className="text-lg font-semibold">{name}</h2>
					</div>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
				<Button
					size="lg"
					variant="ghost"
					className="text-md cursor-pointer border-2 border-transparent hover:border-muted-foreground/20 bg-background hover:bg-card transition-colors"
					asChild
				>
					<Link href={link}>
						<p className="mb-1">Open Tool</p>
						<ArrowRight />
					</Link>
				</Button>
			</div>
		</div>
	);
}
