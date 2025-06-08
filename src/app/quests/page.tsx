import React from "react";
import questData from "@/data/quests/questData.json";
import { assignQuestlines } from "@/data/quests/questUtils";
import type { QuestNode } from "@/data/quests/questUtils";

export default function QuestsPage() {
	// Assign questlines using the imported utility
	const questNodes: QuestNode[] = assignQuestlines(questData as any);

	return (
		<main className="max-w-[1600px] mx-auto p-6">
			<h1 className="text-2xl text-center font-bold mb-6">Quests (with Questlines)</h1>
			{questNodes.length === 0 && <p>No quests found.</p>}
			<ul className="space-y-2">
				{questNodes.map((node) => (
					<QuestItem
						node={node}
						key={node.quest.id}
					/>
				))}
			</ul>
		</main>
	);
}

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestItemProps = {
	node: QuestNode;
};

function QuestItem({ node }: QuestItemProps) {
	const quest = node.quest;
	const hasPrevious = (quest.prereq?.length ?? 0) > 0;
	const hasNext = (quest.next?.length ?? 0) > 0;
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
			<div className="flex flex-col items-center justify-center px-2">
				<div
					className={cn(
						"w-[2px] h-[calc(50%-8px)]",
						hasPrevious ? "bg-blue-500/40" : "bg-transparent"
					)}
				></div>
				<div className="w-[16px] h-[16px] rounded-full border-2 border-blue-500/40"></div>
				<div
					className={cn(
						"w-[2px] h-[calc(50%-8px)]",
						hasNext ? "bg-blue-500/40" : "bg-transparent"
					)}
				></div>
			</div>
			<div className="flex flex-col flex-1 gap-2 border rounded-lg p-4 shadow">
				<div className="flex gap-8">
					<div className="w-1/3 flex flex-col gap-2">
						<h2 className="text-xl font-semibold">
							<span className="font-mono bg-gray-200 px-2 py-1 rounded mr-2">
								{node.questline}
							</span>
							{quest.name}
						</h2>
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
					<div className="w-1/3">
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
					<div className="w-1/3">
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
				{quest.link && (
					<p>
						<a
							href={quest.link}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline"
						>
							Wiki page
						</a>
					</p>
				)}
			</div>
		</li>
	);
}
