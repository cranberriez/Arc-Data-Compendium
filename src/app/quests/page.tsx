import React from "react";
import { fetchQuests, fetchFirstQuestId } from "@/services/dataService.server";
import { QuestList } from "./_components/questList";
import { Quest } from "@/types";
import { Metadata } from "next";
import { QuestListOverview } from "./_components/questListOverview";

export const metadata: Metadata = {
	title: "Quests | ARC Vault",
	description:
		"Quest page listing all quests with their names and descriptions and links for additional details.",
};

export default async function QuestsPage() {
	// Artificial delay for testing loading skeleton
	// await new Promise((res) => setTimeout(res, 5000));
	const questData: Quest[] = await fetchQuests();
	const firstQuestId: string = await fetchFirstQuestId();

	if (!questData || questData.length === 0) return <p>No quests found.</p>;

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<h1 className="text-2xl text-center font-bold">Quests</h1>
				<QuestListOverview firstQuestId={firstQuestId} />
				<QuestList quests={questData} />
			</div>
		</article>
	);
}
