import React from "react";
import type { Quest } from "@/types";
import { fetchQuests } from "@/services/dataService";

export default async function QuestsPage() {
	const questData = await fetchQuests();

	return (
		<main className="max-w-[1600px] mx-auto p-6">
			<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
			{questData.length === 0 && <p>No quests found.</p>}
			<ul className="flex flex-col gap-2">
				{questData.map((quest) => (
					<QuestItem
						quest={quest}
						key={quest.id}
					/>
				))}
			</ul>
		</main>
	);
}

import { ExternalLink, Pin, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type QuestItemProps = {
	quest: Quest;
};

function capitalizeId(id: string) {
	return id
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("_");
}

function QuestItem({ quest }: QuestItemProps) {
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
		<li
			key={quest.id}
			className="flex gap-2"
		>
			{/* TODO: Add questline connections (tree view visualization) */}
			<div className="flex flex-col flex-1 gap-4 border rounded-lg p-4 shadow group/questcard">
				<div className="flex md:flex-row flex-col gap-8">
					<div className="flex flex-col flex-1 gap-2">
						<h2 className="text-xl font-semibold">{quest.name}</h2>
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"flex items-center border-1 rounded-full p-2",
									getTraderColor(quest.trader)
								)}
							>
								<User size={24} />
							</div>
							<span className="font-medium">{quest.trader}</span>
						</div>
						<p className="text-gray-500 text-sm">
							Location:{" "}
							{Array.isArray(quest.location)
								? quest.location.join(", ")
								: quest.location}
						</p>
						{quest.dialog && (
							<blockquote className="italic text-gray-700">
								"{quest.dialog}"
							</blockquote>
						)}
					</div>
					<div className="flex-1">
						<strong>Requirements:</strong>
						<ul className="list-disc ml-6">
							{quest.requirements.map((req, i) => (
								<li key={i}>
									{req.description}
									{typeof req.count === "number" && <span> x{req.count}</span>}
								</li>
							))}
						</ul>
					</div>
					<div className="flex-1">
						<strong>Rewards:</strong>
						<ul className="list-disc ml-6">
							{quest.rewards.map((reward, i) => (
								<li key={i}>
									{reward.description}
									{typeof reward.count === "number" && (
										<span> x{reward.count}</span>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<Button
						variant="ghost"
						className="group-hover/questcard:bg-secondary"
					>
						<FileText className="h-4 w-4" />
						Details
					</Button>
					<Button variant="ghost">
						<Pin className="h-4 w-4" />
						Pin
					</Button>
					<Button
						asChild
						variant="ghost"
						className="hover:text-blue-500 dark:hover:text-blue-300"
					>
						<a
							href={
								quest.link ||
								`https://arcraiders.wiki/wiki/${capitalizeId(quest.id)}`
							}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="h-4 w-4" />
							Wiki
						</a>
					</Button>
				</div>
			</div>
		</li>
	);
}
