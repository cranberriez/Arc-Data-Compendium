import { cn } from "@/lib/utils";
import { ExternalLink, Pin, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quest, QuestObjective, QuestReward } from "@/types";
import Link from "next/link";

type QuestItemProps = {
	quest: Quest;
};

function capitalizeId(id: string) {
	return id
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("_");
}

export function QuestItem({ quest }: QuestItemProps) {
	return (
		<li
			key={quest.id}
			className="flex flex-1 gap-2"
		>
			{/* TODO: Add questline connections (tree view visualization) */}
			<div className="flex flex-col flex-1 gap-4 border rounded-lg p-4 shadow group/questcard">
				<div className="flex md:flex-row flex-col gap-8">
					<QuestHeader quest={quest} />
					<QuestRequirements requirements={quest.requirements} />
					<QuestRewards rewards={quest.rewards} />
				</div>
				<QuestButtons quest={quest} />
			</div>
		</li>
	);
}

function QuestHeader({ quest }: { quest: Quest }) {
	const getTraderColor = (trader: string) => {
		switch (trader) {
			case "Shani":
				return "bg-blue-500/20";
			case "Apollo":
				return "bg-red-500/20";
			case "Celeste":
				return "bg-green-500/20";
			case "Lance":
				return "bg-yellow-500/20";
			case "Tian Wen":
				return "bg-purple-500/20";
			default:
				return "bg-gray-500/20";
		}
	};

	return (
		<div className="flex flex-col flex-1 gap-2">
			<h2 className="text-xl font-semibold">{quest.name}</h2>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex items-center border-1 rounded-full p-2",
						getTraderColor(quest.trader)
					)}
				>
					<User size={16} />
				</div>
				<span className="font-medium">{quest.trader}</span>
			</div>
			<p className="text-gray-500 text-sm">
				Location:{" "}
				{Array.isArray(quest.location) ? quest.location.join(", ") : quest.location}
			</p>
			{quest.dialog && (
				<blockquote className="italic text-gray-700">&quot;{quest.dialog}&quot;</blockquote>
			)}
		</div>
	);
}

function QuestRequirements({ requirements }: { requirements: QuestObjective[] }) {
	return (
		<div className="flex-1">
			<strong>Requirements:</strong>
			<ul className="list-disc ml-6">
				{requirements.map((req, i) => (
					<li key={i}>{req.description}</li>
				))}
			</ul>
		</div>
	);
}

function QuestRewards({ rewards }: { rewards: QuestReward[] }) {
	return (
		<div className="flex-1">
			<strong>Rewards:</strong>
			<ul className="list-disc ml-6">
				{rewards.map((reward, i) => (
					<li key={i}>
						{typeof reward.count === "number" && <span> x{reward.count} </span>}
						{reward.description}
					</li>
				))}
			</ul>
		</div>
	);
}

function QuestButtons({ quest }: { quest: Quest }) {
	return (
		<div className="flex flex-row gap-2">
			<Button
				variant="ghost"
				asChild
			>
				<Link
					href={`/quests/${quest.id}`}
					className="group-hover/questcard:bg-secondary"
				>
					<FileText className="h-4 w-4" />
					Details
				</Link>
			</Button>
			{/* <Button variant="ghost">
				<Pin className="h-4 w-4" />
				Pin
			</Button> */}
			<Button
				asChild
				variant="ghost"
				className="hover:text-blue-500 dark:hover:text-blue-300"
			>
				<a
					href={quest.link || `https://arcraiders.wiki/wiki/${capitalizeId(quest.id)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink className="h-4 w-4" />
					Wiki
				</a>
			</Button>
		</div>
	);
}
