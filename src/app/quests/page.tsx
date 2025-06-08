import React from "react";
import type { Quest } from "@/types";
import { fetchQuests } from "@/services/dataService";
import { QuestItem } from "./components/questItem";

export default async function QuestsPage() {
	// Artificial delay for testing loading skeleton
	// await new Promise((res) => setTimeout(res, 5000));
	const questData = await fetchQuests();

	if (!questData) return <p>No quests found.</p>;

	return (
		<article className="w-full p-4">
			<div className="mx-auto max-w-[1600px]">
				<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
				<ul className="flex flex-col gap-2">
					{questData.map((quest) => (
						<QuestItem
							quest={quest}
							key={quest.id}
						/>
					))}
				</ul>
			</div>
		</article>
	);
}
