import React from "react";
import { fetchQuests } from "@/services/dataService";
import { QuestList } from "./components/questList";

export default async function QuestsPage() {
	// Artificial delay for testing loading skeleton
	// await new Promise((res) => setTimeout(res, 5000));
	const questData = await fetchQuests();

	if (!questData) return <p>No quests found.</p>;

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<h1 className="text-2xl text-center font-bold">Quests</h1>

				<QuestList quests={questData} />
			</div>
		</article>
	);
}
