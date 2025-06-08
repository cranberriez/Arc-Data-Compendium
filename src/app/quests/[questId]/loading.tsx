import React from "react";
import QuestFullSkeleton from "../components/questFullSkeleton";

export default function Loading() {
	// Show 5 skeletons for a realistic loading effect
	return (
		<article className="w-full p-4">
			<div className="mx-auto max-w-[1200px]">
				<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
				<QuestFullSkeleton />
			</div>
		</article>
	);
}
