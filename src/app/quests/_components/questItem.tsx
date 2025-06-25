"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, Pin, FileText, User, Split, Merge } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quest } from "@/types";
import Link from "next/link";
import { QuestRewards } from "./questRewards";
import { QuestDescription } from "./questDescription";
import { useQuests } from "@/contexts/questContext";

type QuestItemProps = {
	quest: Quest;
	questline: number;
	questlineColors: string[];
	tags: string[];
};

function capitalizeId(id: string) {
	return id
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("_");
}

export function QuestItem({ quest, questline, questlineColors, tags }: QuestItemProps) {
	const { activeQuests, completedQuests } = useQuests();
	const requirement = quest.entries.find((entry) => entry.type === "objective");
	const reward = quest.entries.find((entry) => entry.type === "reward");
	const isActive = activeQuests.includes(quest.id);
	const isCompleted = completedQuests.includes(quest.id);
	const questlineColor = questlineColors[questline % questlineColors.length];
	const nextQuestLength = quest.next.length;
	const prevQuestLength = quest.previous.length;

	return (
		<li
			key={quest.id}
			className="flex flex-1 gap-2 relative"
		>
			<div
				className={cn(
					"flex flex-col flex-1 gap-4 border-2 rounded-lg p-4 shadow group/questcard",
					isActive ? "border-arcvault-primary-500/50" : "",
					isCompleted ? "border-arcvault-primary-500/50" : ""
				)}
			>
				<div className="flex md:flex-row flex-col gap-8">
					<QuestHeader quest={quest} />
					<div className="flex-1">
						<h3 className="text-lg font-semibold mb-2">Objectives</h3>
						<QuestDescription requirement={requirement} />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold mb-2">Rewards</h3>
						<QuestRewards
							rewardItems={reward?.items || []}
							xpReward={quest.xpReward || 0}
						/>
					</div>
				</div>
				<div className="flex flex-row items-end justify-between gap-2">
					<QuestButtons quest={quest} />
					<QuestTags
						tags={tags}
						questlineColors={questlineColors}
						questline={questline}
						nextQuestLength={nextQuestLength}
						prevQuestLength={prevQuestLength}
					/>
				</div>
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

function QuestButtons({ quest }: { quest: Quest }) {
	return (
		<div className="flex flex-row items-center gap-2">
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

function QuestTags({
	tags,
	questlineColors,
	questline,
	nextQuestLength,
	prevQuestLength,
}: {
	tags: string[];
	questlineColors: string[];
	questline: number;
	nextQuestLength: number;
	prevQuestLength: number;
}) {
	if (tags.includes("split")) {
		return (
			<div className="flex flex-row items-center gap-2">
				<ColorBubble color={questlineColors[questline % questlineColors.length]} />
				<Split className="h-4 w-4 rotate-90" />
				{Array.from({ length: nextQuestLength }, (_, i) => i + 1).map((i) => (
					<ColorBubble
						key={i}
						color={questlineColors[(questline + i) % questlineColors.length]}
					/>
				))}
			</div>
		);
	} else if (tags.includes("merge")) {
		return (
			<div className="flex flex-row items-center gap-2">
				{Array.from({ length: prevQuestLength }, (_, i) => i + 1).map((i) => (
					<ColorBubble
						key={i}
						color={questlineColors[(questline + i) % questlineColors.length]}
					/>
				))}
				<Merge className="h-4 w-4 rotate-90" />
				<ColorBubble color={questlineColors[questline % questlineColors.length]} />
			</div>
		);
	} else {
		return (
			<div className="flex flex-row items-center gap-2">
				<ColorBubble color={questlineColors[questline % questlineColors.length]} />
			</div>
		);
	}
}

function ColorBubble({ color, className }: { color: string; className?: string }) {
	return <div className={cn("h-3 w-3 rounded-full", color, className)} />;
}
