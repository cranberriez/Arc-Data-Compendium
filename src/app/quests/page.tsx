import React from "react";
import questData from "@/data/quests/questData.json";
import { assignQuestlinesWithColumns } from "@/data/quests/questUtils";
import type { QuestNode } from "@/data/quests/questUtils";

export default function QuestsPage() {
	const { totalColumns, nodes } = assignQuestlinesWithColumns(questData as any);

	return (
		<main className="max-w-[1600px] mx-auto p-6">
			<h1 className="text-2xl text-center font-bold mb-6">Quests (with Questlines)</h1>
			{nodes.length === 0 && <p>No quests found.</p>}
			<ul>
				{nodes.map((node, idx) => (
					<QuestItem
						node={node}
						totalColumns={totalColumns}
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
	totalColumns: number;
};

function QuestItem({ node, totalColumns }: QuestItemProps) {
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
			<Connector
				node={node}
				totalColumns={totalColumns}
			/>
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

function Connector({ node, totalColumns }: { node: QuestNode; totalColumns: number }) {
	const isMerge = node.isMerge;
	const isSplit = node.isSplit;
	const isPrimaryLine = node.isPrimaryLine;

	// Color palette for questlines (extend as needed)
	const lineColors = [
		"#3b82f6", // blue
		"#f472b6", // pink
		"#facc15", // yellow
		"#34d399", // green
		"#a78bfa", // purple
		"#f87171", // red
		"#60a5fa", // light blue
		"#fbbf24", // orange
	];
	function getLineColor(column: number) {
		return lineColors[column % lineColors.length];
	}

	return (
		<div
			className={`grid grid-cols-${totalColumns} gap-0 flex-shrink-0 min-w-[${
				totalColumns * 16
			}px]`}
			style={{ width: totalColumns * 16 }}
		>
			{Array.from({ length: totalColumns }, (_, i) => {
				// Flip: current node's column is always rightmost visually
				if (i === totalColumns - 1) return node.column;
				if (i === node.column) return totalColumns - 1;
				return i;
			}).map((colIdx, i) => {
				return (
					<div
						key={i}
						className="flex flex-col justify-center relative"
					>
						{/* Top Half of line */}
						<div className="h-1/2 w-[2px] mx-auto relative">
							{node.isMerge
								? node.prereqColumns.includes(colIdx) && (
										<div
											className="h-full w-full"
											style={{ backgroundColor: getLineColor(colIdx) }}
										/>
								  )
								: node.column === colIdx && (
										<div
											className="h-full w-full"
											style={{ backgroundColor: getLineColor(colIdx) }}
										/>
								  )}
						</div>
						{/* Dot for current line, only on rightmost column visually */}
						{node.column === colIdx && i === totalColumns - 1 && (
							<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
								<div
									className="rounded-full"
									style={{
										width: 8,
										height: 8,
										backgroundColor: getLineColor(colIdx),
										border: "2px solid white",
									}}
								/>
							</div>
						)}
						{/* Bottom Half of line */}
						<div className="h-1/2 w-[2px] mx-auto">
							{node.isSplit
								? node.nextColumns.includes(colIdx) && (
										<div
											className="h-full w-full"
											style={{ backgroundColor: getLineColor(colIdx) }}
										/>
								  )
								: node.column === colIdx && (
										<div
											className="h-full w-full"
											style={{ backgroundColor: getLineColor(colIdx) }}
										/>
								  )}
						</div>
					</div>
				);
			})}
		</div>
	);
}
